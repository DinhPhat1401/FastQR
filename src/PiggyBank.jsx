import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './PiggyBank.css';

const PiggyBank = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const dragRef = useRef({ startX: 0, startY: 0, isDragging: false });
  const pigRef = useRef(null);

  useEffect(() => {
    // Check localStorage
    const hasSeen = localStorage.getItem('hasSeenPiggy');
    if (!hasSeen) {
      setIsOpen(true);
    }
    setHasMounted(true);

    // Handle window resize to keep pig in bounds
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 80),
        y: Math.min(prev.y, window.innerHeight - 80)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenPiggy', 'true');
  };

  const onPointerDown = (e) => {
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
      isDragging: false,
    };
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e) => {
    dragRef.current.isDragging = true;
    setIsDragging(true);
    let newX = e.clientX - dragRef.current.startX;
    let newY = e.clientY - dragRef.current.startY;

    // Keep in bounds
    newX = Math.max(0, Math.min(newX, window.innerWidth - 80));
    newY = Math.max(0, Math.min(newY, window.innerHeight - 80));

    setPosition({ x: newX, y: newY });
  };

  const onPointerUp = () => {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

    // Slight delay to prevent click event if it was a drag
    setTimeout(() => {
      setIsDragging(false);
      dragRef.current.isDragging = false;
    }, 50);
  };

  const onPigClick = () => {
    if (!dragRef.current.isDragging) {
      setIsOpen(true);
    }
  };

  if (!hasMounted) return null;

  return (
    <>
      {/* Mini Pig */}
      {!isOpen && (
        <div
          ref={pigRef}
          className="mini-pig"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onPointerDown={onPointerDown}
          onClick={onPigClick}
        >
          <svg viewBox="0 0 100 100" width="80" height="80" className="pig-svg">
            <circle cx="50" cy="50" r="45" fill="#fbcfe8" />
            <circle cx="35" cy="40" r="5" fill="#334155" />
            <circle cx="65" cy="40" r="5" fill="#334155" />
            <ellipse cx="50" cy="60" rx="15" ry="10" fill="#f9a8d4" />
            <circle cx="45" cy="60" r="3" fill="#be185d" />
            <circle cx="55" cy="60" r="3" fill="#be185d" />
            <path d="M 15 25 Q 30 5 40 20 Z" fill="#f9a8d4" />
            <path d="M 85 25 Q 70 5 60 20 Z" fill="#f9a8d4" />
          </svg>
        </div>
      )}

      {/* Pop-up */}
      {isOpen && (
        <div className="pig-modal-overlay">
          <div className="pig-modal-content">
            <button className="pig-close-btn" onClick={handleClose} title="Thu nhỏ thành Heo con">
              <X size={24} />
            </button>

            {/* 4 Legs */}
            <div className="pig-leg top-left"></div>
            <div className="pig-leg top-right"></div>
            <div className="pig-leg bottom-left"></div>
            <div className="pig-leg bottom-right"></div>

            {/* Snout */}
            <div className="pig-snout">
              <div className="nostril left"></div>
              <div className="nostril right"></div>
            </div>

            {/* Belly Content */}
            <div className="pig-belly-inner">
              <h2>Chào mừng đến với Fast[QR]!</h2>
              <p>
                Website hỗ trợ tạo mã QR <strong>hoàn toàn miễn phí</strong> và cam kết <strong>KHÔNG CÓ QUẢNG CÁO</strong> khi quét mã.
              </p>
              <p>
                Nếu bạn thấy hữu ích, hãy ủng hộ một ít tiền lẻ để tui <em>'nuôi heo'</em> nhé (Bao nhiêu cũng quý!)
              </p>

              <div className="donate-info">
                <div className="donate-card">
                  <div className="bank-logo momo">MoMo</div>
                  <strong>0796742217</strong>
                </div>
                <div className="donate-card">
                  <div className="bank-logo tpbank">TPBank</div>
                  <strong>DinhPhat1401</strong>
                </div>
              </div>

              <p className="thank-you">Cảm ơn bạn rất nhiều!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PiggyBank;
