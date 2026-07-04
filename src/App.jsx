import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import * as htmlToImage from 'html-to-image';
import PiggyBank from './PiggyBank';
import { 
  Link, Type, Wifi, Contact, Image as ImageIcon, 
  FileText, Music, UploadCloud, Download, Settings2,
  LayoutTemplate, Shapes, Palette, Frame, Image as LogoIcon, RotateCcw, QrCode
} from 'lucide-react';

const QR_TYPES = [
  { id: 'url', label: 'Link/URL', icon: Link },
  { id: 'text', label: 'Văn bản', icon: Type },
  { id: 'vcard', label: 'vCard', icon: Contact },
  { id: 'wifi', label: 'Wifi', icon: Wifi },
  { id: 'image', label: 'Hình ảnh', icon: ImageIcon },
  { id: 'pdf', label: 'PDF', icon: FileText },
  { id: 'audio', label: 'Âm thanh', icon: Music },
];

const PRESET_FRAMES = [
  { 
    id: 'chat-top', 
    label: 'Bong bóng', 
    icon: (
      <svg width="40" height="50" viewBox="0 0 40 50">
        <path d="M5,10 H35 A5,5 0 0,1 40,15 V45 A5,5 0 0,1 35,50 H5 A5,5 0 0,1 0,45 V15 A5,5 0 0,1 5,10 Z" fill="transparent" stroke="#cbd5e1" strokeWidth="2"/>
        <rect x="10" y="20" width="20" height="20" fill="#cbd5e1" rx="2" />
        <polygon points="15,10 25,10 20,5" fill="#8b5cf6"/>
        <rect x="5" y="0" width="30" height="7" rx="3" fill="#8b5cf6"/>
      </svg>
    ) 
  },
  { 
    id: 'phone', 
    label: 'Điện thoại', 
    icon: (
      <svg width="40" height="60" viewBox="0 0 40 60">
        <rect x="2" y="2" width="36" height="56" rx="6" fill="transparent" stroke="#94a3b8" strokeWidth="2"/>
        <rect x="8" y="16" width="24" height="24" fill="#cbd5e1" rx="2"/>
        <line x1="15" y1="8" x2="25" y2="8" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="50" r="3" fill="none" stroke="#cbd5e1" strokeWidth="1.5"/>
      </svg>
    ) 
  },
  { 
    id: 'ticket', 
    label: 'Vé điện tử', 
    icon: (
      <svg width="50" height="40" viewBox="0 0 50 40">
        <rect x="5" y="2" width="40" height="36" rx="4" fill="transparent" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="15" y="10" width="20" height="20" fill="#cbd5e1" rx="2"/>
        <path d="M5,15 A5,5 0 0,0 5,25" fill="#09090b" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M45,15 A5,5 0 0,1 45,25" fill="#09090b" stroke="#cbd5e1" strokeWidth="2" />
      </svg>
    ) 
  },
];

const PRESET_COLORS = [
  { id: 'black-white', dots: '#000000', bg: '#ffffff' },
  { id: 'blue-white', dots: '#1d4ed8', bg: '#ffffff' },
  { id: 'purple-pink', dots: '#7e22ce', bg: '#fdf4ff' },
  { id: 'orange-yellow', dots: '#c2410c', bg: '#fefce8' },
  { id: 'green-mint', dots: '#065f46', bg: '#ecfdf5' },
];

const PRESET_LOGOS = [
  { id: 'none', label: 'Không có', url: '' },
  // Facebook SVG Data URI
  { id: 'facebook', label: 'Facebook', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="%231877F2" d="M32 16A16 16 0 1 0 13.5 31.8v-11H9.4v-4.8h4.1v-3.7c0-4 2.4-6.3 6.1-6.3 1.8 0 3.6.3 3.6.3v4h-2c-2 0-2.6 1.3-2.6 2.6v3.1h4.5l-.7 4.8h-3.8v11A16 16 0 0 0 32 16z"/><path fill="%23FFF" d="M21 16h-4.5v11A16 16 0 0 1 13.5 32v-11H9.4v-4.8h4.1v-3.7c0-4 2.4-6.3 6.1-6.3 1.8 0 3.6.3 3.6.3v4h-2c-2 0-2.6 1.3-2.6 2.6v3.1h4.5l-.7 4.8z"/></svg>' },
  // YouTube SVG Data URI
  { id: 'youtube', label: 'YouTube', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' }
];

const DEFAULT_OPTIONS = {
  width: 140,
  height: 140,
  type: 'svg',
  data: 'https://github.com',
  margin: 0,
  image: '',
  dotsOptions: {
    color: '#000000',
    type: 'square'
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 10
  }
};

const MiniQR = ({ type, color, isActive, onClick }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const qr = new QRCodeStyling({
      width: 120,
      height: 120,
      data: 'preview',
      dotsOptions: { color: color || '#ffffff', type: type },
      backgroundOptions: { color: 'transparent' },
      margin: 0
    });
    if (ref.current) {
      ref.current.innerHTML = '';
      qr.append(ref.current);
    }
  }, [type, color]);

  return (
    <div 
      className={`shape-btn ${isActive ? 'active' : ''}`}
      onClick={() => onClick(type)}
      title={type}
    >
      <div ref={ref} style={{ pointerEvents: 'none', display: 'flex' }} />
    </div>
  );
};

function App() {
  const [activeType, setActiveType] = useState('url');
  const [qrData, setQrData] = useState('https://github.com');
  
  // Customization state
  const [qrOptions, setQrOptions] = useState(DEFAULT_OPTIONS);
  const [selectedFrame, setSelectedFrame] = useState('chat-top');
  const [activeCustomTab, setActiveCustomTab] = useState('frames');

  const [downloadFormat, setDownloadFormat] = useState('png');
  const [downloadSize, setDownloadSize] = useState(1000);

  const qrCodeRef = useRef(null);
  const frameRef = useRef(null);
  const downloadWrapperRef = useRef(null);
  const qrCode = useRef(new QRCodeStyling(qrOptions));

  // Initialize and update QR when options change
  useEffect(() => {
    if (qrCodeRef.current) {
      qrCode.current.update(qrOptions);
      qrCode.current.append(qrCodeRef.current);
    }
  }, [qrOptions]);

  // Update Data dynamically based on user input
  const handleDataChange = (data) => {
    setQrData(data);
    setQrOptions(prev => ({ ...prev, data }));
  };

  const resetDesign = () => {
    setQrOptions({ ...DEFAULT_OPTIONS, data: qrData });
    setSelectedFrame('chat-top');
  };

  const handleDownload = async () => {
    if (!downloadWrapperRef.current) return;
    
    const wrapperNode = downloadWrapperRef.current;
    // Calculate scale to achieve the exact desired download size for the entire exported area
    const currentWidth = wrapperNode.offsetWidth;
    const scale = downloadSize / currentWidth; 
    
    const options = {
      pixelRatio: scale,
      backgroundColor: null, // Keep transparent
      style: {
        margin: '0', // Reset negative margin on the cloned node to prevent shifting
      }
    };

    try {
      let dataUrl;
      if (downloadFormat === 'svg') {
        dataUrl = await htmlToImage.toSvg(wrapperNode, options);
      } else if (downloadFormat === 'jpeg') {
        dataUrl = await htmlToImage.toJpeg(wrapperNode, { ...options, backgroundColor: '#ffffff' });
      } else {
        dataUrl = await htmlToImage.toPng(wrapperNode, options);
      }

      const link = document.createElement('a');
      link.download = `qrcode.${downloadFormat}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading image', err);
      alert('Đã xảy ra lỗi khi tải ảnh. Vui lòng thử lại.');
    }
  };

  const renderForm = () => {
    switch (activeType) {
      case 'url':
        return (
          <div className="control-group">
            <label className="label">Nhập Link / URL</label>
            <input 
              type="url" 
              className="input-field" 
              placeholder="https://example.com"
              onChange={(e) => handleDataChange(e.target.value)}
            />
          </div>
        );
      case 'text':
        return (
          <div className="control-group">
            <label className="label">Nhập Văn Bản</label>
            <textarea 
              className="input-field" 
              rows="4"
              placeholder="Xin chào thế giới..."
              onChange={(e) => handleDataChange(e.target.value)}
            ></textarea>
          </div>
        );
      case 'wifi':
        return (
          <div className="control-group">
            <label className="label">Tên mạng (SSID)</label>
            <input type="text" className="input-field mb-3" placeholder="Tên Wifi" />
            <label className="label mt-3">Mật khẩu</label>
            <input type="password" className="input-field mb-3" placeholder="Mật khẩu" />
            <label className="label mt-3">Mã hóa</label>
            <select className="select-field">
              <option>WPA/WPA2</option>
              <option>WEP</option>
              <option>None</option>
            </select>
          </div>
        );
      case 'image':
      case 'pdf':
      case 'audio':
        return (
          <div className="control-group">
            <div className="file-upload-area">
              <UploadCloud size={48} className="file-upload-icon" />
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontWeight: 500, marginBottom: '4px' }}>Tải file của bạn lên</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  (Demo: Thực tế file sẽ upload lên Cloudinary và lấy URL)
                </p>
              </div>
              <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', marginTop: '8px' }}>
                Chọn File
              </button>
            </div>
          </div>
        );
      default:
        return <p className="text-muted">Đang phát triển...</p>;
    }
  };

  const renderCustomizationTab = () => {
    switch (activeCustomTab) {
      case 'frames':
        return (
          <div className="selection-grid">
            {PRESET_FRAMES.map(f => (
              <div 
                key={f.id} 
                className={`selection-card ${selectedFrame === f.id ? 'active' : ''}`}
                onClick={() => setSelectedFrame(f.id)}
                style={{ padding: '20px 16px', gap: '16px' }}
              >
                <div style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
                  {f.icon}
                </div>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{f.label}</span>
              </div>
            ))}
          </div>
        );
      case 'shapes':
        return (
          <div className="shape-grid">
            {['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'].map(type => (
              <MiniQR 
                key={type}
                type={type}
                color="#f8fafc"
                isActive={qrOptions.dotsOptions.type === type}
                onClick={(t) => setQrOptions(prev => ({
                  ...prev, 
                  dotsOptions: { ...prev.dotsOptions, type: t }
                }))}
              />
            ))}
          </div>
        );
      case 'colors':
        return (
          <div>
            <div className="selection-grid" style={{ marginBottom: '24px' }}>
              {PRESET_COLORS.map(c => (
                <div 
                  key={c.id} 
                  className={`palette-btn ${qrOptions.dotsOptions.color === c.dots && qrOptions.backgroundOptions.color === c.bg ? 'active' : ''}`}
                  onClick={() => setQrOptions(prev => ({
                    ...prev,
                    dotsOptions: { ...prev.dotsOptions, color: c.dots },
                    backgroundOptions: { ...prev.backgroundOptions, color: c.bg }
                  }))}
                >
                  <div className="palette-color" style={{ background: c.bg }}></div>
                  <div className="palette-color" style={{ background: c.dots }}></div>
                </div>
              ))}
            </div>
            
            <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hoặc tùy chỉnh thủ công</h4>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div className="control-group">
                <label className="label">Màu mã QR</label>
                <div className="color-picker-row">
                  <input 
                    type="color" 
                    className="color-input" 
                    value={qrOptions.dotsOptions.color}
                    onChange={(e) => setQrOptions(prev => ({
                      ...prev, 
                      dotsOptions: { ...prev.dotsOptions, color: e.target.value }
                    }))}
                  />
                  <span>{qrOptions.dotsOptions.color}</span>
                </div>
              </div>
              <div className="control-group">
                <label className="label">Màu nền</label>
                <div className="color-picker-row">
                  <input 
                    type="color" 
                    className="color-input" 
                    value={qrOptions.backgroundOptions.color}
                    onChange={(e) => setQrOptions(prev => ({
                      ...prev, 
                      backgroundOptions: { ...prev.backgroundOptions, color: e.target.value }
                    }))}
                  />
                  <span>{qrOptions.backgroundOptions.color}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'logo':
        return (
          <div>
            <div className="selection-grid" style={{ marginBottom: '24px' }}>
              {PRESET_LOGOS.map(l => (
                <div 
                  key={l.id} 
                  className={`selection-card ${qrOptions.image === l.url ? 'active' : ''}`}
                  onClick={() => setQrOptions(prev => ({ ...prev, image: l.url }))}
                  style={{ padding: '12px' }}
                >
                  {l.id === 'none' ? (
                    <span style={{ fontSize: '1.5rem', height: '32px' }}>🚫</span>
                  ) : (
                    <img src={l.url} alt={l.label} style={{ width: '32px', height: '32px' }} />
                  )}
                  <span style={{ fontSize: '0.85rem' }}>{l.label}</span>
                </div>
              ))}
            </div>
            <div className="control-group">
              <label className="label">Hoặc tải logo của bạn lên</label>
              <input 
                type="file" 
                accept="image/*"
                className="input-field"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setQrOptions(prev => ({ ...prev, image: event.target.result }));
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo">
          Fast
          <div className="qr-brackets">
            <span className="corner tl"></span>
            <span className="corner tr"></span>
            <span className="corner bl"></span>
            <span className="corner br"></span>
            QR
          </div>
        </div>
      </header>

      <div className="app-grid">
        
        {/* Left Panel */}
        <div className="left-panel glass-panel">
          <div>
            <h2 className="section-title">Chọn loại mã QR</h2>
            <div className="type-grid">
              {QR_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <div 
                    key={type.id}
                    className={`type-btn ${activeType === type.id ? 'active' : ''}`}
                    onClick={() => setActiveType(type.id)}
                  >
                    <Icon className="type-icon" />
                    <span className="type-label">{type.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <hr style={{ borderColor: 'var(--panel-border)', borderStyle: 'solid', borderWidth: '1px 0 0 0' }} />

          <div>
            <h2 className="section-title">Nội dung QR</h2>
            <div className="form-section">
              {renderForm()}
            </div>
          </div>

          <hr style={{ borderColor: 'var(--panel-border)', borderStyle: 'solid', borderWidth: '1px 0 0 0' }} />

          <div>
            <div className="section-title">
              <div className="section-title-inner">
                <Settings2 size={20} />
                Tùy chỉnh thiết kế
              </div>
              <button className="btn-icon" onClick={resetDesign}>
                <RotateCcw size={16} />
                Đặt lại
              </button>
            </div>
            
            <div className="custom-tabs">
              <button 
                className={`custom-tab-btn ${activeCustomTab === 'frames' ? 'active' : ''}`}
                onClick={() => setActiveCustomTab('frames')}
              >
                <Frame size={16} /> Khung
              </button>
              <button 
                className={`custom-tab-btn ${activeCustomTab === 'shapes' ? 'active' : ''}`}
                onClick={() => setActiveCustomTab('shapes')}
              >
                <Shapes size={16} /> Hình dạng
              </button>
              <button 
                className={`custom-tab-btn ${activeCustomTab === 'colors' ? 'active' : ''}`}
                onClick={() => setActiveCustomTab('colors')}
              >
                <Palette size={16} /> Màu sắc
              </button>
              <button 
                className={`custom-tab-btn ${activeCustomTab === 'logo' ? 'active' : ''}`}
                onClick={() => setActiveCustomTab('logo')}
              >
                <LogoIcon size={16} /> Logo
              </button>
            </div>

            <div className="custom-tab-content">
              {renderCustomizationTab()}
            </div>
          </div>

        </div>

        {/* Right Panel */}
        <div className="right-panel glass-panel">
          <h2 className="section-title" style={{ width: '100%', marginBottom: 0 }}>Xem trước QR</h2>
          
          <div className="qr-preview-container">
            {/* The ref wrapper for html-to-image to capture both frame and QR */}
            <div 
              ref={downloadWrapperRef} 
              style={{ 
                padding: '40px', 
                margin: '-40px', 
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'transparent'
              }}
            >
              <div className={`frame-wrapper frame-${selectedFrame}`} ref={frameRef}>
                <div ref={qrCodeRef} style={{ background: qrOptions.backgroundOptions.color }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', width: '100%', marginTop: '8px' }}>
            <div className="control-group" style={{ flex: 1, gap: '8px' }}>
              <label className="label">Định dạng file</label>
              <select 
                className="select-field"
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>

            <div className="control-group" style={{ flex: 1, gap: '8px' }}>
              <label className="label">Kích thước: {downloadSize}</label>
              <input 
                type="range" 
                min="1000" max="3000" step="100"
                className="range-field"
                value={downloadSize}
                onChange={(e) => setDownloadSize(Number(e.target.value))}
                style={{ marginTop: '8px' }}
              />
            </div>
          </div>

          <button className="btn-primary mt-2" onClick={handleDownload}>
            <Download size={20} />
            Tải xuống QR Code
          </button>
        </div>

      </div>

      <PiggyBank />
    </div>
  );
}

export default App;
