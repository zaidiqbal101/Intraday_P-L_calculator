'use client';

import React, { useState } from 'react';

export default function Home() {
  const [tradingType, setTradingType] = useState<'intraday' | 'delivery'>('intraday');
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [result, setResult] = useState<React.ReactNode>(null);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const [chargesBreakdown, setChargesBreakdown] = useState<any>(null);

  const calculateIntraday = (buy: number, sell: number, qty: number) => {
    const buyValue = buy * qty;
    const sellValue = sell * qty;
    const turnover = buyValue + sellValue;

    // Brokerage (0.03% or Rs 20/order whichever is lower)
    const brokerageBuy = Math.min(20, 0.0003 * buyValue);
    const brokerageSell = Math.min(20, 0.0003 * sellValue);
    const brokerage = brokerageBuy + brokerageSell;

    // STT (0.025% on sell value for intraday)
    const stt = 0.00025 * sellValue;

    // Exchange charges (0.00345% on turnover)
    const exch = 0.0000345 * turnover;

    // SEBI charges (0.0001% on turnover)
    const sebi = 0.000001 * turnover;

    // Stamp duty (0.003% on buy value)
    const stamp = 0.00003 * buyValue;

    // GST (18% on brokerage + exchange charges)
    const gst = 0.18 * (brokerage + exch);

    return {
      brokerage,
      stt,
      exchange: exch,
      sebi,
      stamp,
      gst,
      buyValue,
      sellValue,
      turnover,
      totalCharges: brokerage + stt + exch + sebi + stamp + gst
    };
  };

  const calculateDelivery = (buy: number, sell: number, qty: number) => {
    const buyValue = buy * qty;
    const sellValue = sell * qty;
    const turnover = buyValue + sellValue;

    // Brokerage (0.50% or Rs 20/order whichever is lower)
    const brokerageBuy = Math.min(20, 0.005 * buyValue);
    const brokerageSell = Math.min(20, 0.005 * sellValue);
    const brokerage = brokerageBuy + brokerageSell;

    // STT (0.1% on both buy and sell value for delivery)
    const sttBuy = 0.001 * buyValue;
    const sttSell = 0.001 * sellValue;
    const stt = sttBuy + sttSell;

    // Exchange charges (0.00345% on turnover)
    const exch = 0.0000345 * turnover;

    // SEBI charges (0.0001% on turnover)
    const sebi = 0.000001 * turnover;

    // Stamp duty (0.015% on buy value for delivery)
    const stamp = 0.00015 * buyValue;

    // GST (18% on brokerage + exchange charges)
    const gst = 0.18 * (brokerage + exch);

    // DP charges (for delivery trades, usually Rs 15.93 per scrip sold)
    const dpCharges = sellValue > 0 ? 15.93 : 0;

    return {
      brokerage,
      stt,
      exchange: exch,
      sebi,
      stamp,
      gst,
      dpCharges,
      buyValue,
      sellValue,
      turnover,
      totalCharges: brokerage + stt + exch + sebi + stamp + gst + dpCharges
    };
  };

  const calculate = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseInt(quantity);

    if (isNaN(buy) || isNaN(sell) || isNaN(qty)) {
      setResult(
        <div className="text-red-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          Please enter valid numbers.
        </div>
      );
      return;
    }

    const breakdown = tradingType === 'intraday' 
      ? calculateIntraday(buy, sell, qty)
      : calculateDelivery(buy, sell, qty);

    setChargesBreakdown({
      ...breakdown,
      tradingType
    });

    // Gross & Net profit
    const grossProfit = (sell - buy) * qty;
    const netProfit = grossProfit - breakdown.totalCharges;

    setResult(
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">Gross Profit</div>
            <div className="text-lg font-bold text-blue-800">₹{grossProfit.toFixed(2)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 font-medium">Total Charges</div>
            <div className="text-lg font-bold text-gray-800">₹{breakdown.totalCharges.toFixed(2)}</div>
          </div>
        </div>
        <div className={`p-6 rounded-lg border-2 ${netProfit >= 0 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${netProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-lg font-semibold text-gray-700">Net Profit</span>
            </div>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{netProfit.toFixed(2)}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowBreakdown(true)}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span>📊</span>
          View Detailed Breakdown
        </button>
      </div>
    );
  };

  // Calculate total buy and sell prices
  const buyTotal = (parseFloat(buyPrice) * parseInt(quantity) || 0).toFixed(2);
  const sellTotal = (parseFloat(sellPrice) * parseInt(quantity) || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">📈</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">P&L Calculator</h1>
          <p className="text-slate-300">Calculate your trading profits and losses</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="space-y-6">
            {/* Trading Type Toggle */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="text-lg">🎯</span>
                Trading Type
              </label>
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/20">
                <button
                  onClick={() => setTradingType('intraday')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    tradingType === 'intraday'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  ⚡ Intraday
                </button>
                <button
                  onClick={() => setTradingType('delivery')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    tradingType === 'delivery'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📦 Delivery (CNC)
                </button>
              </div>
            </div>

            {/* Buy Price Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="text-lg">💰</span>
                Buy Price
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={buyPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBuyPrice(e.target.value)
                }
                className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {buyPrice && quantity && (
                <div className="text-xs text-blue-200 bg-blue-500/20 px-3 py-1 rounded-lg">
                  Total Buy Value: ₹{buyTotal}
                </div>
              )}
            </div>

            {/* Sell Price Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="text-lg">💰</span>
                Sell Price
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={sellPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSellPrice(e.target.value)
                }
                className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {sellPrice && quantity && (
                <div className="text-xs text-green-200 bg-green-500/20 px-3 py-1 rounded-lg">
                  Total Sell Value: ₹{sellTotal}
                </div>
              )}
            </div>

            {/* Quantity Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="text-lg">🔢</span>
                Quantity
              </label>
              <input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuantity(e.target.value)
                }
                className="w-full px-4 py-3 bg-white/90 border border-white/30 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Trading Type Info */}
            <div className={`p-3 rounded-lg border ${
              tradingType === 'intraday' 
                ? 'bg-blue-500/10 border-blue-400/30' 
                : 'bg-purple-500/10 border-purple-400/30'
            }`}>
              <div className="text-xs text-white/80">
                {tradingType === 'intraday' ? (
                  <>
                    <span className="font-medium">Intraday:</span> Lower brokerage (0.03%), STT only on sell (0.025%)
                  </>
                ) : (
                  <>
                    <span className="font-medium">Delivery:</span> Higher brokerage (0.50%), STT on both buy & sell (0.1%), includes DP charges
                  </>
                )}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculate}
              className={`w-full bg-gradient-to-r ${
                tradingType === 'intraday'
                  ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  : 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
              } text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2`}
            >
              <span className="text-lg">🧮</span>
              Calculate {tradingType === 'intraday' ? 'Intraday' : 'Delivery'} P&L
            </button>

            {/* Results Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 min-h-[120px] flex items-center justify-center">
              {result ? (
                <div className="w-full text-white">
                  {result}
                </div>
              ) : (
                <div className="text-center text-slate-300">
                  <span className="text-4xl mb-2 opacity-50 block">🧮</span>
                  <p className="text-sm">Enter values and calculate to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            {tradingType === 'intraday' 
              ? 'Intraday: Brokerage, STT, exchange charges, SEBI charges, stamp duty & GST'
              : 'Delivery: Brokerage, STT, exchange charges, SEBI charges, stamp duty, GST & DP charges'
            }
          </p>
        </div>
      </div>

      {/* Charges Breakdown Modal */}
      {showBreakdown && chargesBreakdown && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span>📊</span>
                {chargesBreakdown.tradingType === 'intraday' ? 'Intraday' : 'Delivery'} Charges Breakdown
              </h3>
              <button
                onClick={() => setShowBreakdown(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-gray-600">✕</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Transaction Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span>📋</span>
                  Transaction Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Buy Value:</span>
                    <span className="font-medium">₹{chargesBreakdown.buyValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sell Value:</span>
                    <span className="font-medium">₹{chargesBreakdown.sellValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Total Turnover:</span>
                    <span className="font-medium">₹{chargesBreakdown.turnover.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Charges Breakdown */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <span>💸</span>
                  Deduction Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-700 font-medium">Brokerage</div>
                      <div className="text-xs text-gray-500">
                        {chargesBreakdown.tradingType === 'intraday' 
                          ? '0.03% or ₹20/order (whichever is lower)'
                          : '0.50% or ₹20/order (whichever is lower)'
                        }
                      </div>
                    </div>
                    <span className="font-medium text-red-600">₹{chargesBreakdown.brokerage.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-700 font-medium">STT</div>
                      <div className="text-xs text-gray-500">
                        {chargesBreakdown.tradingType === 'intraday' 
                          ? '0.025% on sell value'
                          : '0.1% on both buy & sell value'
                        }
                      </div>
                    </div>
                    <span className="font-medium text-red-600">₹{chargesBreakdown.stt.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-700 font-medium">Exchange Charges</div>
                      <div className="text-xs text-gray-500">0.00345% on turnover</div>
                    </div>
                    <span className="font-medium text-red-600">₹{chargesBreakdown.exchange.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-700 font-medium">SEBI Charges</div>
                      <div className="text-xs text-gray-500">0.0001% on turnover</div>
                    </div>
                    <span className="font-medium text-red-600">₹{chargesBreakdown.sebi.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-700 font-medium">Stamp Duty</div>
                      <div className="text-xs text-gray-500">
                        {chargesBreakdown.tradingType === 'intraday' 
                          ? '0.003% on buy value'
                          : '0.015% on buy value'
                        }
                      </div>
                    </div>
                    <span className="font-medium text-red-600">₹{chargesBreakdown.stamp.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-700 font-medium">GST</div>
                      <div className="text-xs text-gray-500">18% on brokerage + exchange charges</div>
                    </div>
                    <span className="font-medium text-red-600">₹{chargesBreakdown.gst.toFixed(2)}</span>
                  </div>

                  {/* DP Charges (only for delivery) */}
                  {chargesBreakdown.tradingType === 'delivery' && (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-gray-700 font-medium">DP Charges</div>
                        <div className="text-xs text-gray-500">₹15.93 per scrip sold</div>
                      </div>
                      <span className="font-medium text-red-600">₹{chargesBreakdown.dpCharges.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2 flex justify-between items-center">
                    <div className="text-gray-700 font-semibold">Total Charges</div>
                    <span className="font-bold text-red-600 text-lg">
                      ₹{chargesBreakdown.totalCharges.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trading Type Comparison */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <span>📚</span>
                  Trading Type Info
                </h4>
                <div className="text-xs text-gray-600 space-y-2">
                  <div>
                    <span className="font-medium text-blue-600">Intraday:</span> Buy & sell on same day. Lower charges, positions auto-squared off by 3:20 PM.
                  </div>
                  <div>
                    <span className="font-medium text-purple-600">Delivery (CNC):</span> Hold stocks for days/years. Higher charges but shares credited to demat account.
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBreakdown(false)}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}