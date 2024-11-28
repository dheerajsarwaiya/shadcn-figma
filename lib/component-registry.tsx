import React from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { AutoLayoutContainer } from "../components/auto-layout-container";

// Icon components
const IconHome = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className="w-4 h-4"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconSettings = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

type IconType = 'none' | 'home' | 'settings';

// Icon mapping
const icons: Record<IconType, (() => JSX.Element) | null> = {
  none: null,
  home: IconHome,
  settings: IconSettings,
};

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fillWidth?: boolean;
  leftIcon: IconType;
  rightIcon: IconType;
  showShortcut?: boolean;
  shortcutText?: string;
}

// Enhanced Button Component
const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>((props, ref) => {
  const {
    leftIcon,
    rightIcon,
    showShortcut,
    shortcutText,
    fillWidth,
    ...buttonProps
  } = props;

  const LeftIcon = leftIcon && leftIcon !== "none" ? icons[leftIcon] : null;
  const RightIcon = rightIcon && rightIcon !== "none" ? icons[rightIcon] : null;
  
  const className = `${fillWidth ? 'w-full' : ''} ${props.className || ''}`.trim();
  
  return (
    <Button {...buttonProps} ref={ref} className={className}>
      {LeftIcon && <LeftIcon />}
      {props.children}
      {RightIcon && <RightIcon />}
      {showShortcut && shortcutText && (
        <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs">
          {shortcutText}
        </span>
      )}
    </Button>
  );
});

EnhancedButton.displayName = 'EnhancedButton';

export const componentRegistry = {
  container: {
    component: AutoLayoutContainer,
    label: "Container",
    defaultProps: {
      direction: "vertical",
      spacing: "4",
      align: "start",
      justify: "start",
      padding: "4",
      width: "full",
      fillChildren: false,
      fillWidth: false,
      children: [],
      className: "",
    },
    properties: {
      direction: {
        label: "Direction",
        type: "select",
        options: ["horizontal", "vertical"],
      },
      spacing: {
        label: "Spacing",
        type: "select",
        options: ["0", "1", "2", "4", "6", "8", "12", "16"],
      },
      align: {
        label: "Align Items",
        type: "select",
        options: ["start", "center", "end", "stretch"],
      },
      justify: {
        label: "Justify Content",
        type: "select",
        options: ["start", "center", "end", "between", "around"],
      },
      padding: {
        label: "Padding",
        type: "select",
        options: ["0", "2", "4", "6", "8", "12", "16"],
      },
      width: {
        label: "Width",
        type: "select",
        options: ["full", "1/2", "1/3", "2/3", "1/4", "3/4", "auto"],
      },
      fillChildren: {
        label: "Fill All Children",
        type: "boolean",
        description: "Make all children take up full container width",
      },
      fillWidth: {
        label: "Fill Container Width",
        type: "boolean",
        description: "Make this component take up full width of its container",
      },
      className: {
        label: "Custom Classes",
        type: "string",
        description:
          "Add Tailwind classes for styling (e.g. bg-blue-500 text-white w-32 h-12)",
      },
    },
  },
  button: {
    component: EnhancedButton,
    label: "Button",
    defaultProps: {
      children: "Button",
      variant: "primary",
      size: "md",
      fillWidth: false,
      className: "",
      leftIcon: "none",
      rightIcon: "none",
      showShortcut: false,
      shortcutText: "",
    },
    properties: {
      children: {
        label: "Text",
        type: "string",
      },
      variant: {
        label: "Variant",
        type: "select",
        options: ["primary", "secondary", "ghost"],
      },
      size: {
        label: "Size",
        type: "select",
        options: ["sm", "md", "lg"],
      },
      leftIcon: {
        label: "Left Icon",
        type: "select",
        options: ["none", "home", "settings"],
      },
      rightIcon: {
        label: "Right Icon",
        type: "select",
        options: ["none", "home", "settings"],
      },
      showShortcut: {
        label: "Show Shortcut",
        type: "boolean",
        description: "Display keyboard shortcut badge",
      },
      shortcutText: {
        label: "Shortcut Text",
        type: "string",
        description: "Keyboard shortcut to display (e.g. Ctrl+S)",
      },
      fillWidth: {
        label: "Fill Container Width",
        type: "boolean",
        description: "Make this component take up full width of its container",
      },
      className: {
        label: "Custom Classes",
        type: "string",
        description:
          "Add Tailwind classes for styling (e.g. bg-blue-500 text-white w-32 h-12)",
      },
    },
  },
  input: {
    component: Input,
    label: "Input",
    defaultProps: {
      placeholder: "Type here...",
      fillWidth: false,
      className: "",
    },
    properties: {
      placeholder: {
        label: "Placeholder",
        type: "string",
      },
      fillWidth: {
        label: "Fill Container Width",
        type: "boolean",
        description: "Make this component take up full width of its container",
      },
      className: {
        label: "Custom Classes",
        type: "string",
        description:
          "Add Tailwind classes for styling (e.g. bg-gray-100 text-gray-900 w-32 h-12)",
      },
    },
  },
  card: {
    component: Card,
    label: "Card",
    defaultProps: {
      className: "p-4",
      fillWidth: false,
      children: "Card Content",
    },
    properties: {
      children: {
        label: "Content",
        type: "string",
      },
      fillWidth: {
        label: "Fill Container Width",
        type: "boolean",
        description: "Make this component take up full width of its container",
      },
      className: {
        label: "Custom Classes",
        type: "string",
        description:
          "Add Tailwind classes for styling (e.g. bg-white text-gray-900 w-64 h-48)",
      },
    },
  },
  label: {
    component: Label,
    label: "Label",
    defaultProps: {
      children: "Label",
      fillWidth: false,
      className: "",
    },
    properties: {
      children: {
        label: "Text",
        type: "string",
      },
      fillWidth: {
        label: "Fill Container Width",
        type: "boolean",
        description: "Make this component take up full width of its container",
      },
      className: {
        label: "Custom Classes",
        type: "string",
        description:
          "Add Tailwind classes for styling (e.g. text-blue-600 font-bold)",
      },
    },
  },
} as const;
