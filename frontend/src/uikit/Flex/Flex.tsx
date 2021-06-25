import React from "react";

// https://github.com/buildo/react-flexview

type Children = React.ReactNode;

export type Overwrite<O1, O2> = Pick<O1, Exclude<keyof O1, keyof O2>> & O2;

declare let process: { env: { NODE_ENV: "production" | "development" } };

function warn(warning: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(warning);
  }
}

function some(array: any[], predicate: (v: any) => boolean): boolean {
  return array.filter(predicate).length > 0;
}

type ElementProps = Omit<React.HTMLProps<HTMLElement>, "ref">;

type FlexProps = {
  /** Flex content */
  children?: Children;
  /** flex-direction: column */
  column?: boolean;
  /** align content vertically */
  vAlignContent?: "top" | "center" | "bottom";
  /** align content horizontally */
  hAlignContent?: "left" | "center" | "right";
  /** margin-left property ("auto" to align self right) */
  marginLeft?: string | number;
  /** margin-top property ("auto" to align self bottom) */
  marginTop?: string | number;
  /** margin-right property ("auto" to align self left) */
  marginRight?: string | number;
  /** margin-bottom property ("auto" to align self top) */
  marginBottom?: string | number;
  /** grow property (for parent primary axis) */
  grow?: boolean | number;
  /** flex-shrink property */
  shrink?: boolean | number;
  /** flex-basis property */
  basis?: string | number;
  /** wrap content */
  wrap?: boolean;
  /** height property (for parent secondary axis) */
  height?: string | number;
  /** width property (for parent secondary axis) */
  width?: string | number;
  /** fillHeight property 100% */
  fillHeight?: boolean;
  /** fillWidth property 100% */
  fillWidth?: boolean;
  /** class to pass to top level element of the component */
  className?: string;
  /** style object to pass to top level element of the component */
  style?: React.CSSProperties;
  /** native dom component to render. Defaults to div */
  component?: keyof JSX.IntrinsicElements;
};

interface IFlexProps extends Overwrite<ElementProps, FlexProps> {}

export class FlexInternal extends React.Component<
  IFlexProps & { componentRef?: React.Ref<HTMLElement> }
> {
  componentDidMount() {
    this.logWarnings();
  }

  logWarnings(): void {
    const { basis, children, column, hAlignContent, vAlignContent } =
      this.props;

    if (basis === "auto") {
      warn(
        'basis is "auto" by default: forcing it to "auto"  will leave "shrink:true" as default'
      );
    }

    if (
      process.env.NODE_ENV !== "production" &&
      typeof children !== "undefined" &&
      !column &&
      hAlignContent === "center"
    ) {
      const atLeastOneChildHasHMarginAuto = some(
        [].concat(children as any),
        (child: any) => {
          const props =
            (typeof child === "object" && child !== null
              ? child.props
              : undefined) || {};
          const style = props.style || {};

          const marginLeft = style.marginLeft || props.marginLeft;
          const marginRight = style.marginRight || props.marginRight;
          return marginLeft === "auto" && marginRight === "auto";
        }
      );

      atLeastOneChildHasHMarginAuto &&
        warn(
          'In a row with hAlignContent="center" there should be no child with marginLeft and marginRight set to "auto"\nhttps://github.com/buildo/react-flexview/issues/30'
        );
    }

    if (
      process.env.NODE_ENV !== "production" &&
      typeof children !== "undefined" &&
      column &&
      vAlignContent === "center"
    ) {
      const atLeastOneChildHasVMarginAuto = some(
        [].concat(children as any),
        (child: any) => {
          const props =
            (typeof child === "object" && child !== null
              ? child.props
              : undefined) || {};
          const style = props.style || {};

          const marginTop = style.marginTop || props.marginTop;
          const marginBottom = style.marginBottom || props.marginBottom;
          return marginTop === "auto" && marginBottom === "auto";
        }
      );

      atLeastOneChildHasVMarginAuto &&
        warn(
          'In a column with vAlignContent="center" there should be no child with marginTop and marginBottom set to "auto"\nhttps://github.com/buildo/react-flexview/issues/30'
        );
    }
  }

  getGrow(): number {
    const { grow } = this.props;
    if (typeof grow === "number") {
      return grow;
    }
    if (grow) {
      return 1;
    }

    return 0; // default
  }

  getShrink(): number {
    const { basis, shrink } = this.props;
    if (typeof shrink === "number") {
      return shrink;
    }
    if (shrink) {
      return 1;
    }
    if (shrink === false) {
      return 0;
    }

    if (basis && basis !== "auto") {
      return 0;
    }

    return 1; // default
  }

  getBasis(): string {
    const { basis } = this.props;
    if (basis) {
      const suffix =
        typeof basis === "number" || String(parseInt(basis, 10)) === basis
          ? "px"
          : "";
      return `${basis}${suffix}`;
    }

    return "auto"; // default
  }

  getStyle(): React.CSSProperties {
    const {
      column,
      fillHeight,
      fillWidth,
      hAlignContent,
      vAlignContent,
      wrap,
    } = this.props;

    const style = {
      width: this.props.width,
      height: this.props.height,
      marginLeft: this.props.marginLeft,
      marginTop: this.props.marginTop,
      marginRight: this.props.marginRight,
      marginBottom: this.props.marginBottom,
    };

    function alignPropToFlex(
      align: IFlexProps["vAlignContent"] | IFlexProps["hAlignContent"]
    ) {
      switch (align) {
        case "top":
        case "left":
          return "flex-start";
        case "center":
          return "center";
        case "bottom":
        case "right":
          return "flex-end";
        default:
      }
    }

    return {
      boxSizing: "border-box",

      // some browsers don't set these by default on flex
      minWidth: 0,
      minHeight: 0,
      // flex properties
      display: "flex",
      flexDirection: column ? "column" : "row",
      flexWrap: wrap ? "wrap" : "nowrap",
      flex: `${this.getGrow()} ${this.getShrink()} ${this.getBasis()}`,
      justifyContent: alignPropToFlex(column ? vAlignContent : hAlignContent),
      alignItems: alignPropToFlex(column ? hAlignContent : vAlignContent),

      // style passed through props
      ...style,
      height: fillHeight ? "100%" : "initial",
      width: fillWidth ? "100%" : "initial",
      ...this.props.style,
    };
  }

  getElementProps(): ElementProps & { [k in keyof FlexProps]?: never } {
    const {
      basis,
      children,
      className,
      column,
      component,
      componentRef,
      fillHeight,
      fillWidth,
      grow,
      hAlignContent,
      height,
      marginBottom,
      marginLeft,
      marginRight,
      marginTop,
      shrink,
      style,
      vAlignContent,
      width,
      wrap,
      ...rest
    } = this.props;

    return rest;
  }

  render() {
    // eslint-disable-next-line react/no-children-prop
    return React.createElement(this.props.component || "div", {
      ref: this.props.componentRef,
      className: this.props.className,
      style: this.getStyle(),
      children: this.props.children,
      ...this.getElementProps(),
    });
  }
}

export const Flex = React.forwardRef(
  (props: IFlexProps, ref: React.Ref<HTMLElement>) => (
    <FlexInternal {...props} componentRef={ref} />
  )
);
