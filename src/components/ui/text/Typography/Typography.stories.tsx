import type { Meta, StoryObj } from "@storybook/react";

import { Typography } from "./Typography";

const meta: Meta<typeof Typography> = {
  component: Typography,
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Primary: Story = {
  args: {
    variant: "default",
    size: "display-d1",
    as: "h1",
    children: "The ships hung in the sky in much the same way that bricks don’t.",
  },
};
