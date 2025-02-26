import React, { useState, useEffect } from 'react';

const DEFAULT_CENTER = {
  lat: 28.6139,  // Delhi's coordinates
  lng: 77.2090
};

const AssetMap = ({ asset }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: asset?.location?.latitude ?? DEFAULT_CENTER.lat,
    lng: asset?.location?.longitude ?? DEFAULT_CENTER.lng
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update location when asset changes
    if (asset?.location) {
      setLocation({
        lat: asset.location.latitude,
        lng: asset.location.longitude
      });
    }
  }, [asset]);

  // ... rest of the component
};

export default AssetMap; 