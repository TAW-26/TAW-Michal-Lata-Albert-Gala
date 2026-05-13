import { Spin } from 'antd';

/**
 * Centered loading spinner — replaces 4+ identical inline-style
 * wrappers scattered across ProtectedRoute, AdminRoute,
 * ChooseScreen, and FacilityId.
 */
const LoadingSpinner = ({ size = 'large', minHeight = '60vh' }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
      }}
    >
      <Spin size={size} />
    </div>
  );
};

export default LoadingSpinner;
