declare global {
  interface Window {
    L: {
      map: (element: HTMLElement | string, options?: any) => any;
      tileLayer: (url: string, options?: any) => any;
      marker: (latLng: [number, number], options?: any) => any;
      circleMarker: (latLng: [number, number], options?: any) => any;
      polyline: (latLngs: [number, number][], options?: any) => any;
      divIcon: (options?: any) => any;
      latLngBounds: (latLngs: [number, number][]) => any;
    };
  }
}

export {};
