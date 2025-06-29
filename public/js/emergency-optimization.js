
      // Preload emergency protocols
      if (typeof window !== 'undefined') {
        const emergencyData = [
          '/api/emergency/protocols',
          '/api/emergency/contacts',
          '/api/emergency/medical-info'
        ];
        
        emergencyData.forEach(url => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = url;
          link.as = 'fetch';
          document.head.appendChild(link);
        });
      }
    