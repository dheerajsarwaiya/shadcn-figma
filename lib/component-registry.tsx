import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AutoLayoutContainer } from "@/components/auto-layout-container";

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
        label: "Fill Children",
        type: "boolean",
        description: "Make children take up full container width",
      },
      className: {
        label: "Custom Classes",
        type: "string",
        description: "Add Tailwind classes for styling (e.g. bg-blue-500 text-white w-32 h-12)",
      },
    },
  },
  button: {
    component: Button,
    label: "Button",
    defaultProps: {
      children: "Button",
      variant: "default",
      className: "",
    },
    properties: {
      children: {
        label: "Text",
        type: "string",
      },
      variant: {
        label: "Variant",
        type: "select",
        options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      },
      className: {
        label: "Custom Classes",
        type: "string",
        description: "Add Tailwind classes for styling (e.g. bg-blue-500 text-white w-32 h-12)",
      },
    },
  },
  input: {
    component: Input,
    label: "Input",
    defaultProps: {
      placeholder: "Type here...",
      className: "",
    },
    properties: {
      placeholder: {
        label: "Placeholder",
        type: "string",
      },
      className: {
        label: "Custom Classes",
        type: "string",
        description: "Add Tailwind classes for styling (e.g. bg-gray-100 text-gray-900 w-32 h-12)",
      },
    },
  },
  card: {
    component: Card,
    label: "Card",
    defaultProps: {
      className: "p-4",
      children: "Card Content",
    },
    properties: {
      children: {
        label: "Content",
        type: "string",
      },
      className: {
        label: "Custom Classes",
        type: "string",
        description: "Add Tailwind classes for styling (e.g. bg-white text-gray-900 w-64 h-48)",
      },
    },
  },
  label: {
    component: Label,
    label: "Label",
    defaultProps: {
      children: "Label",
      className: "",
    },
    properties: {
      children: {
        label: "Text",
        type: "string",
      },
      className: {
        label: "Custom Classes",
        type: "string",
        description: "Add Tailwind classes for styling (e.g. text-blue-600 font-bold)",
      },
    },
  },
} as const;
