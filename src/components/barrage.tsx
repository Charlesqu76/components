/**
 * @format
 * @Author: Charles.qu
 * @Date: 2022-12-20 11:11:21
 */
import React, { Fragment } from "react";
import clsx from "clsx";

type BulletConfig = {
  time?: number;
  lineNum?: number;
  initPosition?: number;
  speed?: number;
};

type LineData = { position: number; width: number; accPreWidth: number };

interface IProps<T> {
  containerClass?: string;
  config?: BulletConfig;
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
}

class Barrage<T> extends React.Component<IProps<T>> {
  bulletRef: React.RefObject<HTMLDivElement>;
  lineData = [[]] as (LineData & T)[][];
  lineWidth = 0;
  preTimeStep = 0;
  fps = 60;
  // 锁帧
  fpsInterval = 1000 / this.fps;
  speedList = [] as any[];
  constructor(props: IProps<T>) {
    super(props);
    if (!props.renderItem) throw new Error("renderItem needed");
    this.bulletRef = React.createRef();
    this.init();
  }

  componentDidMount(): void {
    this.initFrameData();
    this.animation();
  }

  // 初始化弹道，弹幕
  init = () => {
    const { lineNum = 1 } = this.props.config || {};
    const { data } = this.props;
    this.lineData = data.reduce((acc, cur, i) => {
      // 弹幕所处弹道
      const line = i % lineNum;
      if (acc[line]) {
        acc[line].push(cur);
      } else {
        acc[line] = [cur];
      }
      return acc;
    }, [] as T[][]) as any;
  };

  initFrameData = () => {
    const { time = 15, initPosition, speed } = this.props.config || {};
    // @ts-ignore
    const bulletLines = this.bulletRef?.current?.children || [];
    if (!bulletLines.length) return;
    // 弹道宽度
    this.lineWidth = (bulletLines[0] as HTMLElement)?.offsetWidth || 0;
    Array.from(bulletLines).forEach((bulletLine: any, i: number) => {
      let acc = 0;
      Array.from(bulletLine?.children).forEach((bullet: any, j: number) => {
        // 弹幕宽度
        const width = bullet.offsetWidth;
        this.lineData[i][j].width = width;
        // 初始化弹幕位置
        this.lineData[i][j].position = initPosition ?? this.lineWidth;
        // 相对位置
        this.lineData[i][j].accPreWidth = acc;
        acc += width;
      });
      // 弹道速度，不同弹道速度不一致
      const realSpeed =
        speed || (acc + this.lineWidth) / ((time * 1000) / this.fpsInterval);
      this.speedList.push(realSpeed);
    });
  };

  animation = () => {
    // 右到左循环
    const bulletLines = this.bulletRef.current?.children || [];
    const loop = () => {
      requestAnimationFrame((timestep: any) => {
        // 锁帧
        if (timestep - this.preTimeStep < Math.floor(this.fpsInterval)) {
          loop();
          return;
        }
        this.preTimeStep = timestep;
        for (let i = 0; i < bulletLines.length; i++) {
          const line = bulletLines[i];
          const lineSpeed = this.speedList[i];
          for (let j = 0; j < line.children.length; j++) {
            const { position, width, accPreWidth } = this.lineData[i][j];
            const ele = line.children[j] as HTMLElement;

            ele.style.transform = `translate3d(${position}px, 0, 0)`;
            // 排队
            // 元素超出可视区域重置位置，否则继续移动
            if (position + accPreWidth + width <= 0) {
              // 上一个元素位置
              let preItem = this.lineData[i][j - 1];
              if (j - 1 < 0) {
                const len = this.lineData[i].length;
                preItem = this.lineData[i][len - 1];
              }
              const {
                position: prePosition,
                width: preWidth,
                accPreWidth: preAccPreWidth,
              } = preItem;
              if (this.lineWidth - prePosition - preAccPreWidth < preWidth) {
                const p =
                  preWidth -
                  (this.lineWidth - prePosition - preAccPreWidth) +
                  this.lineWidth -
                  accPreWidth;

                this.lineData[i][j].position = p;
              } else {
                this.lineData[i][j].position = this.lineWidth - accPreWidth;
              }
            } else {
              this.lineData[i][j].position = position - lineSpeed;
            }
          }
        }

        loop();
      });
    };
    loop();
  };

  renderLines = () => {
    const { renderItem } = this.props;
    return this.lineData?.map((line: any[], index: number) => {
      return (
        <div className="flex relative *:flex-shrink-0" key={`bullet_${index}`}>
          {line?.map((item, i: number) => {
            return <Fragment key={i}>{renderItem(item, i)}</Fragment>;
          })}
        </div>
      );
    });
  };

  render() {
    return (
      <div className="" ref={this.bulletRef}>
        {this.renderLines()}
      </div>
    );
  }
}

export default Barrage;
