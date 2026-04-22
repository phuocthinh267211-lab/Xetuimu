import React from 'react';
import { motion } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartItem {
  boxId: string;
  name: string;
  price: number;
  count: number;
}

export const CartView: React.FC<{ 
  items: CartItem[], 
  onUpdateCount: (boxId: string, delta: number) => void,
  onRemove: (boxId: string) => void,
  onCheckout: () => void,
  onBack: () => void
}> = ({ items, onUpdateCount, onRemove, onCheckout, onBack }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.count, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto p-4 space-y-6"
    >
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-400 font-bold">Quay lại</button>
        <h2 className="text-xl font-black text-white italic">GIỎ HÀNG</h2>
        <div className="w-8" />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-500">Giỏ hàng đang trống</div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.boxId} className="bg-[#1e293b] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-16 h-16 bg-black/40 rounded-xl flex items-center justify-center text-4xl">🎁</div>
              <div className="flex-1">
                <p className="font-bold text-white">{item.name}</p>
                <p className="text-yellow-500 font-black text-sm">{item.price.toLocaleString()}đ</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onUpdateCount(item.boxId, -1)} className="p-1 bg-white/10 rounded-lg"><Minus className="w-4 h-4 text-white" /></button>
                <span className="font-black text-white w-6 text-center">{item.count}</span>
                <button onClick={() => onUpdateCount(item.boxId, 1)} className="p-1 bg-white/10 rounded-lg"><Plus className="w-4 h-4 text-white" /></button>
              </div>
              <button onClick={() => onRemove(item.boxId)} className="text-red-500"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}

          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center text-white">
              <span className="font-bold">Tổng tiền:</span>
              <span className="font-black text-2xl text-yellow-500">{total.toLocaleString()}đ</span>
            </div>
            <button onClick={onCheckout} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 py-4 rounded-2xl font-black text-red-900 active:scale-95 transition-transform">
              THANH TOÁN TẤT CẢ
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
