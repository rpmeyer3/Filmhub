# Setting Up Resend for Email Sending

## What is Resend?
Resend is a modern email API service that makes it easy to send transactional and marketing emails.

## Setup Instructions

### 1. Create a Resend Account
1. Go to https://resend.com
2. Sign up for a free account
3. You get 3,000 emails/month for free on the free tier

### 2. Get Your API Key
1. Log in to your Resend dashboard
2. Go to "API Keys" in the sidebar
3. Click "Create API Key"
4. Give it a name (e.g., "Film-Hub Production")
5. Copy the API key (starts with `re_`)

### 3. Add to Your .env File
Open `Backend/.env` and update:
```
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

### 4. Verify Your Domain (Optional but Recommended)
For production, you should verify your domain:
1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., filmhub.com)
4. Add the DNS records they provide to your domain
5. Wait for verification (usually takes a few minutes)

### 5. Update the "from" Email
In `Backend/movies/views.py`, update line 1033:
```python
"from": "Film-Hub <noreply@yourdomain.com>",  # Replace with your verified domain
```

## Testing

### Development Mode (No API Key)
- If `RESEND_API_KEY` is not set or is the placeholder value
- Emails will be printed to the console
- Perfect for local testing

### Production Mode (With API Key)
- Set a valid `RESEND_API_KEY` in your `.env` file
- Emails will be sent via Resend
- You'll see "✓ Sent email to user@example.com via Resend" in console

## Current Implementation

The promotion email system now:
- ✅ Sends beautiful HTML emails with styling
- ✅ Includes plain text fallback
- ✅ Shows promo code prominently
- ✅ Has a "Book Now" call-to-action button
- ✅ Automatically switches between console (dev) and Resend (prod)
- ✅ Handles errors gracefully

## Email Template Features
- Professional header with Film-Hub branding
- Highlighted promo code in a dashed box
- Large, bold discount percentage
- Clear validity dates
- Call-to-action button
- Unsubscribe link
- Responsive design

## Cost
- Free tier: 3,000 emails/month
- Pay as you go: $1 per 1,000 emails after free tier
- Much cheaper than SendGrid for small to medium volumes

## Support
- Documentation: https://resend.com/docs
- Email deliverability is excellent
- No credit card required for free tier
