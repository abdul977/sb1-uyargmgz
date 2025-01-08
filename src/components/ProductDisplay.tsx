import React, { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Heart, Share2, ArrowLeft } from 'lucide-react';

const VARIANTS = {
  colors: ['Midnight Black', 'Silver', 'Rose Gold'],
  sizes: ['41mm', '45mm']
};

interface ProductDisplayProps {
  onAddToCart: (product: any) => void;
}

export default function ProductDisplay({ onAddToCart }: ProductDisplayProps) {
  const [selectedColor, setSelectedColor] = useState(VARIANTS.colors[0]);
  const [selectedSize, setSelectedSize] = useState(VARIANTS.sizes[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d'
  ].map(url => `${url}?auto=format&fit=crop&w=800&q=80`);

  const handleAddToCart = () => {
    onAddToCart({
      name: 'SmartWatch Pro Max',
      color: selectedColor,
      size: selectedSize,
      price: 499.99
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center space-x-4 mb-6">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1" />
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div className="space-y-4">
          <Zoom>
            <img
              src={images[currentImageIndex]}
              alt="SmartWatch Pro Max"
              className="w-full rounded-2xl"
            />
          </Zoom>
          <div className="grid grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative rounded-lg overflow-hidden ${
                  currentImageIndex === idx ? 'ring-2 ring-purple-600' : ''
                }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">SmartWatch Pro Max</h1>
            <p className="text-2xl font-semibold">$499.99</p>
            <p className="text-sm text-gray-500">Last item in stock</p>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="text-sm font-medium mb-4">Color: {selectedColor}</h3>
            <div className="flex space-x-3">
              {VARIANTS.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full border-2 ${
                    selectedColor === color
                      ? 'border-purple-600'
                      : 'border-transparent'
                  }`}
                  style={{
                    backgroundColor: color === 'Midnight Black' ? '#1a1a1a' 
                      : color === 'Silver' ? '#e2e2e2'
                      : '#f7cac9'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-sm font-medium mb-4">Size</h3>
            <div className="grid grid-cols-2 gap-3">
              {VARIANTS.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-6 rounded-full text-sm font-medium ${
                    selectedSize === size
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Product details</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Always-on Retina LTPO OLED display</li>
              <li>• Water resistant to 50 meters</li>
              <li>• Dual-core S8 processor</li>
              <li>• Advanced health monitoring</li>
              <li>• GPS + Cellular connectivity</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={() => {}}
              className="p-3 border rounded-full hover:bg-gray-50"
            >
              <Heart className="w-6 h-6" />
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-full font-medium hover:bg-purple-700"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}