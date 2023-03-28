import React, { Component, ChangeEvent } from 'react';
import Color, { ColorProps } from './color';

type ShowColorsProps = {
  colors: ColorProps[];
};

type ShowColorsState = {
  colors: ColorProps[];
  filters: {
    red: boolean;
    green: boolean;
    blue: boolean;
    saturation: boolean;
  };
};

class ShowColors extends Component<ShowColorsProps, ShowColorsState> {
  constructor(props: ShowColorsProps) {
    super(props);
    this.state = {
      colors: [],
      filters: {
        red: false,
        green: false,
        blue: false,
        saturation: false,
      },
    };
  }

  handleAddColor = (color: ColorProps) => {
    this.setState(
      (prevState) => ({
        colors: [...prevState.colors, color],
      }),
      () => {
        localStorage.setItem('colors', JSON.stringify(this.state.colors));
      }
    );
  };

  componentDidMount() {
    this.loadColorsFromLocalStorage();
  }

  componentDidUpdate(prevProps: ShowColorsProps) {
    if (prevProps.colors !== this.props.colors) {
      this.loadColorsFromLocalStorage();
    }
  }

  loadColorsFromLocalStorage = () => {
    const colors = localStorage.getItem('colors');
    const parsedColors = colors ? JSON.parse(colors) : [];
    this.setState({ colors: parsedColors });
  };

  hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const hexValue = hex.replace('#', '');
    const r = parseInt(hexValue.substring(0, 2), 16);
    const g = parseInt(hexValue.substring(2, 4), 16);
    const b = parseInt(hexValue.substring(4, 6), 16);

    return { r, g, b };
  };

  rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
        default:
          break;
      }
    }
    return { h, s, l };
  };

  handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        [name]: checked,
      },
    }));
  };
      
    render() {
        const { colors, filters } = this.state;
        const filteredColors = colors.filter((color) => {
            const { r, g, b } = this.hexToRgb(color.hex);
            const { h, s } = this.rgbToHsl(r, g, b);
            const redFilter = !filters.red || (filters.red && r > 150);
            const greenFilter = !filters.green || (filters.green && g > 150);
            const blueFilter = !filters.blue || (filters.blue && b > 150);
            const saturationFilter = !filters.saturation || (filters.saturation && s > 0.5);
    
            return redFilter && greenFilter && blueFilter && saturationFilter;
        });
  
        return (
            <div>
                <div>
                    <label>
                    <input type="checkbox" name="red" checked={filters.red} onChange={this.handleFilterChange} />
                    Red
                    </label>
                </div>
                <div>
                    <label>
                    <input type="checkbox" name="green" checked={filters.green} onChange={this.handleFilterChange} />
                    Green
                    </label>
                </div>
                <div>
                    <label>
                    <input type="checkbox" name="blue" checked={filters.blue} onChange={this.handleFilterChange} />
                    Blue
                    </label>
                </div>
                <div>
                    <label>
                    <input
                        type="checkbox"
                        name="saturation"
                        checked={filters.saturation}
                        onChange={this.handleFilterChange}
                    />
                    Saturation
                    </label>
                </div>
                    <ul>
                        {filteredColors.map((color, index) => (
                        <Color key={index} {...color} />
                        ))}
                    </ul>
            </div>
        );
    }
}

export default ShowColors;
