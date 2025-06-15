import { render } from '@testing-library/react-native';
import PinModal from '../pinModal';

test('shows input placeholder', () => {
  const { getByPlaceholderText } = render(<PinModal />);
  expect(getByPlaceholderText('Enter PIN')).toBeTruthy();
});
