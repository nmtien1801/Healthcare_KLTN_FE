// const payWithMomo = async () => {
//   try {
//     const res = await fetch("/api/momo", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         amount: 50000,
//         orderId: "order123",
//       }),
//     });

//     const data = await res.json();
//     if (data.payUrl) {
//       window.location.href = data.payUrl; // chuyển hướng sang MoMo
//     }
//   } catch (err) {
//     console.error("Thanh toán MoMo lỗi:", err);
//   }
// };

// export default function PaymentButton() {
//   return <button onClick={payWithMomo}>Thanh toán MoMo</button>;
// }

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  SafeAreaView,
} from 'react-native';

const MoMoPayment = () => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    orderInfo: '',
  });
  const [loading, setLoading] = useState(false);

  const generateOrderId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER_${timestamp}_${random}`;
  };

  const createPayment = async () => {
    if (!paymentData.amount || !paymentData.orderInfo) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const amount = parseInt(paymentData.amount);
    if (amount < 1000 || amount > 50000000) {
      Alert.alert('Lỗi', 'Số tiền phải từ 1,000 đến 50,000,000 VND');
      return;
    }

    setLoading(true);

    try {
      const orderId = generateOrderId();

      const response = await fetch('http://localhost:5000/api/momo/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          orderInfo: paymentData.orderInfo,
          orderId: orderId,
          extraData: JSON.stringify({
            userId: 'user123',
            productId: 'product456',
            platform: 'react-native'
          }),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Mở MoMo app hoặc browser
        const canOpen = await Linking.canOpenURL(data.payUrl);
        
        if (canOpen) {
          await Linking.openURL(data.payUrl);
          
          Alert.alert(
            'Thành công',
            'Đã chuyển đến ứng dụng MoMo để thanh toán',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Có thể thêm logic kiểm tra trạng thái thanh toán
                  console.log('Payment initiated for order:', orderId);
                }
              }
            ]
          );
        } else {
          Alert.alert('Lỗi', 'Không thể mở ứng dụng MoMo');
        }
      } else {
        Alert.alert('Lỗi', data.message || 'Có lỗi xảy ra khi tạo thanh toán');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/momo/check-status/${orderId}`);
      const data = await response.json();

      if (data.success) {
        Alert.alert('Trạng thái thanh toán', `Đơn hàng: ${orderId}\nTrạng thái: ${data.status}`);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kiểm tra trạng thái thanh toán');
    }
  };

  const formatCurrency = (text) => {
    // Loại bỏ ký tự không phải số
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Format thành currency
    if (numericValue) {
      return new Intl.NumberFormat('vi-VN').format(numericValue);
    }
    return '';
  };

  const handleAmountChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPaymentData(prev => ({
      ...prev,
      amount: numericValue
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Thanh toán MoMo</Text>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số tiền (VND)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số tiền"
              value={formatCurrency(paymentData.amount)}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              maxLength={15}
            />
            {paymentData.amount && (
              <Text style={styles.amountHelper}>
                {new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND' 
                }).format(paymentData.amount)}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thông tin đơn hàng</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mô tả đơn hàng"
              value={paymentData.orderInfo}
              onChangeText={(text) => setPaymentData(prev => ({
                ...prev,
                orderInfo: text
              }))}
              multiline
              numberOfLines={3}
              maxLength={100}
            />
            <Text style={styles.charCount}>
              {paymentData.orderInfo.length}/100
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={createPayment}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.payButtonText}>Đang xử lý...</Text>
              </View>
            ) : (
              <Text style={styles.payButtonText}>Thanh toán với MoMo</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.momoLogo}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <Text style={styles.poweredBy}>Powered by MoMo</Text>
          </View>
          <Text style={styles.description}>
            Thanh toán an toàn và tiện lợi
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  amountHelper: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  payButton: {
    backgroundColor: '#AE2D68',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  momoLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#AE2D68',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  poweredBy: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default MoMoPayment;