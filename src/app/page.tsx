'use client';

import React, { useState } from 'react';

export default function Home() {
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [result, setResult] = useState<React.ReactNode>(null);

  const calculate = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseInt(quantity);

    if (isNaN(buy) || isNaN(sell) || isNaN(qty)) {
      setResult('⚠️ Please enter valid numbers.');
      return;
    }

    const buyValue = buy * qty;
    const sellValue = sell * qty;
    const turnover = buyValue + sellValue;

    // Brokerage (0.03% or Rs 20/order)
    const brokerageBuy = Math.min(20, 0.0003 * buyValue);
    const brokerageSell = Math.min(20, 0.0003 * sellValue);
    const brokerage = brokerageBuy + brokerageSell;

    // STT
    const stt = 0.00025 * sellValue;

    // Exchange charges
    const exch = 0.0000345 * turnover;

    // SEBI charges
    const sebi = 0.000001 * turnover;

    // Stamp duty
    const stamp = 0.00003 * buyValue;

    // GST
    const gst = 0.18 * (brokerage + exch);

    // Total charges
    const totalCharges = brokerage + stt + exch + sebi + stamp + gst;

    // Gross & Net profit
    const grossProfit = (sell - buy) * qty;
    const netProfit = grossProfit - totalCharges;

    setResult(
      <>
        <b style={{ color: '#000' }}>Gross Profit:</b> ₹{grossProfit.toFixed(2)} <br />
        <b style={{ color: '#000' }}>Total Charges:</b> ₹{totalCharges.toFixed(2)} <br />
        <b style={{ color: netProfit >= 0 ? 'green' : 'red' }}>
          Net Profit:
        </b>{' '}
        ₹{netProfit.toFixed(2)}
      </>
    );
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        margin: '40px',
        background: '#f5f7fa',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000', // Ensure default text color
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          margin: 'auto',
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          color: '#000', // Ensure container text color
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#000', // Explicit text color
          }}
        >
          Intraday P&L Calculator
        </h2>

        <label
          style={{
            fontWeight: 'bold',
            color: '#000', // Explicit text color
          }}
        >
          Buy Price
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="Enter Buy Price"
          value={buyPrice}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setBuyPrice(e.target.value)
          }
          style={{
            width: '100%',
            padding: '8px',
            margin: '8px 0 16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxSizing: 'border-box',
            color: '#000', // Input text color
          }}
        />

        <label
          style={{
            fontWeight: 'bold',
            color: '#000', // Explicit text color
          }}
        >
          Sell Price
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="Enter Sell Price"
          value={sellPrice}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSellPrice(e.target.value)
          }
          style={{
            width: '100%',
            padding: '8px',
            margin: '8px 0 16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxSizing: 'border-box',
            color: '#000', // Input text color
          }}
        />

        <label
          style={{
            fontWeight: 'bold',
            color: '#000', // Explicit text color
          }}
        >
          Quantity
        </label>
        <input
          type="number"
          placeholder="Enter Quantity"
          value={quantity}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuantity(e.target.value)
          }
          style={{
            width: '100%',
            padding: '8px',
            margin: '8px 0 16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxSizing: 'border-box',
            color: '#000', // Input text color
          }}
        />

        <button
          onClick={calculate}
          style={{
            width: '100%',
            padding: '10px',
            background: '#007bff',
            color: 'white', // Explicit button text color
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#0056b3')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#007bff')}
        >
          Calculate
        </button>

        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f1f1f1',
            borderRadius: '8px',
            minHeight: '60px', // Ensure div is visible
            color: '#000', // Explicit text color
            boxSizing: 'border-box',
          }}
        >
          {result || 'Enter values and click Calculate to see results.'}
        </div>
      </div>
    </div>
  );
}