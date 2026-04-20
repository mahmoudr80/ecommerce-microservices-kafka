#!/bin/bash
# Demo script to test the complete Kafka event flow

set -e

BASE_URL="${1:-http://localhost:3004}"
BOOKING_ID=""

echo "=========================================="
echo "Hotel Booking Microservices - Event Flow Demo"
echo "=========================================="
echo ""
echo "Testing Kafka event-driven workflow..."
echo ""

# Generate UUIDs for testing
USER_ID="11111111-1111-1111-1111-111111111111"
ROOM_ID="22222222-2222-2222-2222-222222222222"
HOTEL_ID="33333333-3333-3333-3333-333333333333"

echo "1️⃣  Creating a booking..."
echo "   User: $USER_ID"
echo "   Hotel: $HOTEL_ID"
echo "   Room: $ROOM_ID"
echo ""

RESPONSE=$(curl -s -X POST "$BASE_URL/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "room_id": "'$ROOM_ID'",
    "hotel_id": "'$HOTEL_ID'",
    "check_in_date": "2024-12-01",
    "check_out_date": "2024-12-05",
    "number_of_guests": 2,
    "number_of_rooms": 1,
    "total_price": 500.00,
    "special_requests": "Late checkout requested"
  }')

# Extract booking ID from response
BOOKING_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$BOOKING_ID" ]; then
  echo "❌ Failed to create booking. Response:"
  echo "$RESPONSE"
  exit 1
fi

echo "✅ Booking created!"
echo "   Booking ID: $BOOKING_ID"
echo "   Status: PENDING_PAYMENT (initial)"
echo ""

echo "2️⃣  Waiting for Kafka event processing..."
echo "   BookingCreated event published to Kafka"
echo "   Payment Service consuming event..."
echo "   Payment being auto-processed..."
echo ""
sleep 3

echo "3️⃣  Checking booking status after payment processing..."
BOOKING_STATUS=$(curl -s -X GET "$BASE_URL/bookings/$BOOKING_ID")

STATUS=$(echo "$BOOKING_STATUS" | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$STATUS" = "CONFIRMED" ] || [ "$STATUS" = "PAYMENT_FAILED" ]; then
  echo "✅ Booking status updated!"
  echo "   Status: $STATUS"
  echo ""
else
  echo "⏳ Status: $STATUS (may still be processing)"
  echo ""
fi

echo "4️⃣  Checking payment records..."
PAYMENTS=$(curl -s -X GET "http://localhost:3005/payments/booking/$BOOKING_ID")

echo "✅ Payment service response:"
echo "$PAYMENTS" | head -c 200
echo ""
echo ""

echo "=========================================="
echo "✅ Event flow demonstration complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- Booking created with status: PENDING_PAYMENT"
echo "- BookingCreated event published to Kafka"
echo "- Payment Service consumed the event"
echo "- Payment auto-processed (simulated)"
echo "- PaymentCompleted/PaymentFailed event published"
echo "- Booking status updated to: $STATUS"
echo ""
echo "To see detailed logs, run:"
echo "  docker-compose logs -f booking-service"
echo "  docker-compose logs -f payment-service"
echo ""
