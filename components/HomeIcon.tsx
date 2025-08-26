import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HomeIconProps {
  size?: number;
  color?: string;
}

export default function HomeIcon({ size = 24, color = '#000000' }: HomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M7.42233 0.539279c-0.23895 -0.219039 -0.60571 -0.219039 -0.84466 0L0.901947 5.74203C0.566175 6.04982 0.375 6.4844 0.375 6.9399V12c0 0.8975 0.72754 1.625 1.625 1.625h10c0.8975 0 1.625 -0.7275 1.625 -1.625V6.9399c0 -0.4555 -0.1912 -0.89008 -0.5269 -1.19787L7.42233 0.539279ZM1.7466 6.66347 7 1.84786l5.2534 4.81561c0.0775 0.07103 0.1216 0.17132 0.1216 0.27643V12c0 0.2071 -0.1679 0.375 -0.375 0.375H8V9c0 -0.55229 -0.44772 -1 -1 -1s-1 0.44771 -1 1v3.375H2c-0.20711 0 -0.375 -0.1679 -0.375 -0.375V6.9399c0 -0.10511 0.04412 -0.2054 0.1216 -0.27643Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        strokeWidth="1"
      />
    </Svg>
  );
}
