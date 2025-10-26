from rest_framework import serializers
from .models import Movie, UserFavorite, MovieReview, PaymentCard, User
from datetime import date
import re


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'


class UserFavoriteSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    
    class Meta:
        model = UserFavorite
        fields = ['id', 'movie', 'created_at']


class MovieReviewSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    
    class Meta:
        model = MovieReview
        fields = ['id', 'user_username', 'movie_title', 'rating', 'review_text', 'created_at', 'updated_at']


class PaymentCardSerializer(serializers.ModelSerializer):
    cvv = serializers.CharField(write_only=True, required=True, min_length=3, max_length=4)
    expiration_month = serializers.IntegerField(write_only=True, required=True, min_value=1, max_value=12)
    expiration_year = serializers.IntegerField(write_only=True, required=True)
    user_id = serializers.UUIDField(write_only=True, required=False)
    
    class Meta:
        model = PaymentCard
        fields = ['id', 'cardholder_name', 'card_number', 'expiration_date', 
                  'last_four', 'brand', 'cvv', 'expiration_month', 'expiration_year', 'user_id']
        read_only_fields = ['id', 'last_four', 'brand', 'expiration_date']
        extra_kwargs = {
            'card_number': {'write_only': True}
        }
    
    def validate_card_number(self, value):
        # Remove spaces and dashes
        card_number = re.sub(r'[\s-]', '', value)
        
        # Check if only digits
        if not card_number.isdigit():
            raise serializers.ValidationError("Card number must contain only digits")
        
        # Check length 
        if len(card_number) < 13 or len(card_number) > 19:
            raise serializers.ValidationError(f"Card number must be between 13 and 19 digits (got {len(card_number)})")
        
        # Luhn algorithm
        def luhn_check(card_num):
            digits = [int(d) for d in card_num]
            checksum = 0
            for i, digit in enumerate(reversed(digits)):
                if i % 2 == 1:
                    digit *= 2
                    if digit > 9:
                        digit -= 9
                checksum += digit
            return checksum % 10 == 0
        
        if not luhn_check(card_number):
            raise serializers.ValidationError("Invalid card number (failed Luhn check)")
        
        return card_number
    
    def validate_expiration_year(self, value):
        current_year = date.today().year
        if value < current_year or value > current_year + 20:
            raise serializers.ValidationError("Invalid expiration year")
        return value
    
    def validate(self, data):
        month = data.get('expiration_month')
        year = data.get('expiration_year')
        
        if month and year:
            try:
                exp_date = date(year, month, 1)
                # Check if card is expired
                today = date.today()
                if exp_date.year < today.year or (exp_date.year == today.year and exp_date.month < today.month):
                    raise serializers.ValidationError("Card has expired")
            except ValueError:
                raise serializers.ValidationError("Invalid expiration date")
        
        return data
    
    def get_card_brand(self, card_number):
        # Remove spaces
        card_number = re.sub(r'[\s-]', '', card_number)
        
        # Card brand patterns
        if card_number.startswith('4'):
            return 'Visa'
        elif card_number.startswith(('51', '52', '53', '54', '55')) or (2221 <= int(card_number[:4]) <= 2720):
            return 'MasterCard'
        elif card_number.startswith(('34', '37')):
            return 'American Express'
        elif card_number.startswith('6011') or card_number.startswith(tuple(str(i) for i in range(644, 650))):
            return 'Discover'
        else:
            return 'Unknown'
    
    def create(self, validated_data):
        # Extract write-only fields
        cvv = validated_data.pop('cvv')
        expiration_month = validated_data.pop('expiration_month')
        expiration_year = validated_data.pop('expiration_year')
        user_id = validated_data.pop('user_id', None)
        
        # Get card number and determine brand
        card_number = validated_data.get('card_number')
        brand = self.get_card_brand(card_number)
        
        # Store last 4 digits
        last_four = card_number[-4:]
        
        # Create expiration date
        expiration_date = date(expiration_year, expiration_month, 1)
        
        # Create the card
        # NOTE: In production, you should encrypt the full card number
        # For now, we'll store it as-is (not recommended for production)
        card = PaymentCard.objects.create(
            user_id=user_id,
            cardholder_name=validated_data.get('cardholder_name'),
            card_number=card_number,  # In production: encrypt this!
            expiration_date=expiration_date,
            last_four=last_four,
            brand=brand
        )
        
        return card
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Only show last 4 digits, not full card number
        if 'card_number' in representation:
            representation['card_number'] = f"****{instance.last_four}"
        return representation
