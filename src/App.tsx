import React, { useState } from 'react';
import DeviceFrame from './components/DeviceFrame';
import PhotoView from './components/PhotoView';
import CategoryView from './components/CategoryView';
import DetailsView from './components/DetailsView';
import AnalysingView from './components/AnalysingView';
import SuccessView from './components/SuccessView';
import ReportView from './components/ReportView';

import { ScreenType, UploadedPhoto, DamagePart, SeatStatus, IncidentDetails } from './types';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('photo');
  const [lightMode, setLightMode] = useState<boolean>(true);

  // Core State Holders holding data across steps
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  
  const [damageParts, setDamageParts] = useState<DamagePart[]>([
    { id: 'front_bumper', name: '전방 범퍼', selected: false, x: 28, y: 72 },
    { id: 'rear_bumper', name: '후방 범퍼', selected: false, x: 80, y: 72 },
    { id: 'headlight', name: '헤드라이트', selected: false, x: 34, y: 28 },
    { id: 'side_mirror', name: '사이드 미러(우)', selected: false, x: 70, y: 28 },
    { id: 'windshield', name: '앞유리', selected: false, x: 50, y: 50 }
  ]);
  const [damageSeverity, setDamageSeverity] = useState<number>(35);

  const [dirtySeats, setDirtySeats] = useState<SeatStatus[]>([
    { id: 'driver', name: '운전석 FL', selected: false },
    { id: 'passenger', name: '조수석 FR', selected: false },
    { id: 'rear_l', name: '뒷자측 RL', selected: false },
    { id: 'rear_m', name: '뒷자중 RM', selected: false },
    { id: 'rear_r', name: '뒷자우 RR', selected: false }
  ]);
  const [dirtSeverity, setDirtSeverity] = useState<number>(25);

  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  const [details, setDetails] = useState<IncidentDetails>({
    involvedParties: ['car'],
    accidentDetailsText: '',
    selectedInsurance: 300000 // default 30만원
  });

  // Reset helper when choosing to go home/restart
  const handleResetSimulator = () => {
    setPhotos([]);
    setDamageParts(prev => prev.map(p => ({ ...p, selected: false })));
    setDamageSeverity(35);
    setDirtySeats(prev => prev.map(s => ({ ...s, selected: false })));
    setDirtSeverity(25);
    setActiveCategories([]);
    setDetails({
      involvedParties: ['car'],
      accidentDetailsText: '',
      selectedInsurance: 300000
    });
    setScreen('photo');
  };

  // Safe navigation back handler on DeviceFrame title bar
  const handleDeviceBackPress = () => {
    if (screen === 'photo') handleResetSimulator();
    else if (screen === 'category') setScreen('photo');
    else if (screen === 'details') setScreen('category');
    else if (screen === 'report') handleResetSimulator();
    else if (screen === 'camera' || screen === 'scanning') setScreen('photo');
  };

  // Determine navbar title on device depending on current screen
  const getScreenTitle = () => {
    switch (screen) {
      case 'photo': return '사진 업로드';
      default: return '사고 유형';
    }
  };

  return (
    <DeviceFrame
      lightMode={lightMode}
      setLightMode={setLightMode}
      title={getScreenTitle()}
      onBack={
        screen === 'analysing' || screen === 'success'
          ? undefined
          : handleDeviceBackPress
      }
    >
      {screen === 'photo' && (
        <PhotoView
          photos={photos}
          setPhotos={setPhotos}
          lightMode={lightMode}
          onNext={() => setScreen('category')}
          onCancel={handleResetSimulator}
        />
      )}

      {screen === 'category' && (
        <CategoryView
          lightMode={lightMode}
          damageParts={damageParts}
          setDamageParts={setDamageParts}
          damageSeverity={damageSeverity}
          setDamageSeverity={setDamageSeverity}
          dirtySeats={dirtySeats}
          setDirtySeats={setDirtySeats}
          dirtSeverity={dirtSeverity}
          setDirtSeverity={setDirtSeverity}
          activeCategories={activeCategories}
          setActiveCategories={setActiveCategories}
          onNext={() => setScreen('details')}
          onBack={() => setScreen('photo')}
        />
      )}

      {screen === 'details' && (
        <DetailsView
          lightMode={lightMode}
          details={details}
          setDetails={setDetails}
          onNext={() => setScreen('analysing')}
          onBack={() => setScreen('category')}
        />
      )}

      {screen === 'analysing' && (
        <AnalysingView
          lightMode={lightMode}
          onFinish={() => setScreen('success')}
          onCancel={() => setScreen('details')}
        />
      )}

      {screen === 'success' && (
        <SuccessView
          lightMode={lightMode}
          onFinish={() => setScreen('report')}
        />
      )}

      {screen === 'report' && (
        <ReportView
          lightMode={lightMode}
          onGoHome={handleResetSimulator}
          photos={photos}
          damageParts={damageParts}
          damageSeverity={damageSeverity}
          dirtySeats={dirtySeats}
          dirtSeverity={dirtSeverity}
          details={details}
          activeCategories={activeCategories}
        />
      )}
    </DeviceFrame>
  );
}