from rest_framework import serializers
from .models import ShowRoom

class ShowRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowRoom
        fields = ['id', 'name', 'capacity', 'rows', 'seats_per_row']
    
    def validate_capacity(self, value):
        if value < 1:
            raise serializers.ValidationError("Capacity must be at least 1")
        return value
    
    def validate_rows(self, value):
        if value < 1 or value > 20:
            raise serializers.ValidationError("Rows must be between 1 and 20")
        return value
    
    def validate_seats_per_row(self, value):
        if value < 1 or value > 30:
            raise serializers.ValidationError("Seats per row must be between 1 and 30")
        return value
    
    def validate(self, data):
        rows = data.get('rows', 10)
        seats_per_row = data.get('seats_per_row', 12)
        capacity = data.get('capacity', 0)
        
        calculated_capacity = rows * seats_per_row
        if capacity != calculated_capacity:
            data['capacity'] = calculated_capacity
        
        return data
