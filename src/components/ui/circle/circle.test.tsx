import { ElementStates } from "../../../types/element-states";
import { Circle } from "./circle";
import renderer from 'react-test-renderer'

describe('Тестируем компонент <Circle />', () => {
  it('Тестирование рендеринга без букв', () => {
    const circle = renderer
    .create(<Circle />)
    .toJSON();
    expect(circle).toMatchSnapshot();
  });

  it('Тестирование рендеринга с буквами', () => {
    const circle = renderer
    .create(<Circle letter="фыв" />)
    .toJSON();
    expect(circle).toMatchSnapshot();
  });

  it('Тестирование ренеринга с head и tail', () => {
    const circle = renderer
    .create(<Circle letter="авы" head={'head'} tail={'tail'} />)
    .toJSON();
    expect(circle).toMatchSnapshot();
  });

  it('Тестирование рендеринга с react-элементом в head и tail, и пропом isSmall', () => {
    const circle = renderer
    .create(<Circle letter="gfs" head={<Circle letter="hty" isSmall />} tail={<Circle letter="hgyu" isSmall />}  />)
    .toJSON();
    expect(circle).toMatchSnapshot();
  });

  it('Тестирование рендеринга с index', () => {
    const circle = renderer
    .create(<Circle index={2} />)
    .toJSON();
    expect(circle).toMatchSnapshot();
  });

  it('Тестирование рендеринга в состоянии default', () => {
    const circle = renderer
    .create(<Circle state={ElementStates.Default} />)
    .toJSON()
    expect(circle).toMatchSnapshot();
  })

  it('Тестирование рендеринга в состоянии changing', () => {
    const circle = renderer
    .create(<Circle state={ElementStates.Changing} />)
    .toJSON()
    expect(circle).toMatchSnapshot();
  })

  it('Тестирование рендеринга в состоянии modified', () => {
    const circle = renderer
    .create(<Circle state={ElementStates.Modified} />)
    .toJSON();
    expect(circle).toMatchSnapshot();
  })
})