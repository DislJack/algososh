import { Button } from "./button";
import renderer from 'react-test-renderer';
import {render, screen, fireEvent} from '@testing-library/react';

describe('Тестирование рендеринга кнопки: а) с текстом, б) без текста, в) блокирование, г) с индикатором загрузки', () => {
  it('Тестирование рендеринга кнопки с текстом', () => {
    const button = renderer
    .create(<Button text="текст кнопки" />)
    .toJSON();
    expect(button).toMatchSnapshot();
  });

  it('Тестирование рендеринга кнопки без текста', () => {
    const button = renderer
    .create(<Button />)
    .toJSON()
    expect(button).toMatchSnapshot();
  })

  it('Тестирование рендеринга заблокированной кнопки', () => {
    const button = renderer
    .create(<Button disabled={true} />)
    .toJSON()
    expect(button).toMatchSnapshot();
  })

  it('Тестирование рендеринга кнопки с загрузкой', () => {
    const button = renderer
    .create(<Button isLoader={true} />)
    .toJSON()
    expect(button).toMatchSnapshot();
  });

  it('Тестирование клика по кнопке', () => {
    const animationFunction = jest.fn();
    // Реализация клика должна быть сделана не так как тестирование выше
    render(<Button text="Текст" onClick={animationFunction} />);
    const button = screen.getByText('Текст');
    fireEvent.click(button);
    expect(animationFunction).toBeCalled();
  })
})