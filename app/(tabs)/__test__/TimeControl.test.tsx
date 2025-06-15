import { render } from '@testing-library/react-native';
import TimeControl from '../TimeControl';

test('renders a start button', () => {
  const { getByText } = render(<TimeControl />);
  expect(getByText('Start')).toBeTruthy();
});
