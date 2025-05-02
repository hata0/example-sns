import { Meta, StoryObj } from "@storybook/react";

const DesignColorsComponent = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col">
        <span>border</span>
        <div className="border-border border p-1">Sample Text</div>
      </div>
      <div className="flex flex-col">
        <span>input</span>
        <input className="border-input border p-1" />
      </div>
      <div className="flex flex-col">
        <span>ring</span>
        <input className="ring-ring p-1 ring-1" />
      </div>
    </div>
  );
};

type Story = StoryObj<typeof DesignColorsComponent>;

export const DesignColors: Story = {};

export default {
  title: "Colors",
  component: DesignColorsComponent,
} satisfies Meta<typeof DesignColorsComponent>;
