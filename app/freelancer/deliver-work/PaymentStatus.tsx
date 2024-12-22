import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';

interface PaymentStatus {
  job_title: string;
  amount: string;
  payment_status: string;
  completed_at: string | null;
}

type StatusStylesType = {
  [key: string]: string;
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = (status: string): string => {
    const styles: StatusStylesType = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      in_escrow: 'bg-gray-100 text-gray-800',
    };
    return styles[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(status)}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default function PaymentStatusPage() {
  const { userId } = useUser();
  const freelancerId = userId;
  
  const [payments, setPayments] = useState<PaymentStatus[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!freelancerId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:4000/api/payment/status?freelancerId=${freelancerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }
        const data = await response.json();
        
        // Handle both single payment object and array of payments
        const paymentsArray = Array.isArray(data) ? data : [data];
        setPayments(paymentsArray);
      } catch (err) {
        console.error('Error fetching payment status:', err);
        setError('Төлбөрийн мэдээллийг авахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentStatus();
  }, [freelancerId]);

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        <span className="ml-3 text-lg text-gray-700">Төлбөрийн статусыг ачааллаж байна...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
          <div className="text-red-500 text-center">
            <div className="mx-auto h-12 w-12 text-red-500 mb-4">
              ⚠️
            </div>
            <p className="text-lg font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-500 text-lg">Төлбөрийн мэдээлэл олдсонгүй</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Төлбөрийн төлөв</h1>
          <p className="text-gray-500">Нийт {payments.length} төлбөрийн мэдээлэл</p>
        </div>
        
        <div className="space-y-6">
          {payments.map((payment, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {payment.job_title}
                    </h2>
                    <StatusBadge status={payment.payment_status} />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-500 mb-1">Төлбөр:</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-500 mb-1">Платформын Хураамж:</p>
                      <p className="text-lg text-gray-900">
                        {formatCurrency(parseFloat(payment.amount) * 0.05)}
                      </p>
                      <p className="text-xs text-gray-500">(5%)</p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-green-50">
                      <p className="text-sm text-gray-500 mb-1">Та хүлээн авах:</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(parseFloat(payment.amount) - parseFloat(payment.amount) * 0.05)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}