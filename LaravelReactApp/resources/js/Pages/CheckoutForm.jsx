import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret, amount, onSuccess, buyerName, buyerAddress }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!stripe || !elements) return;
    }, [stripe, elements]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: buyerName,
                    address: {
                        line1: buyerAddress,
                    },
                },
            },
        });

        if (error) {
            setError(error.message);
            setIsProcessing(false);
        } else if (paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <CardElement />
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="px-4 py-2 bg-green-500 text-white rounded"
            >
                {isProcessing ? 'Processing...' : `Pay ${amount} EUR`}
            </button>
        </form>
    );
};

export default CheckoutForm;