import { z } from 'zod';
export const storySchema = z.object({
 from: z.string().trim().max(50), to: z.string().trim().max(50), occasion: z.enum(['anniversary','birthday','justbecause']),
 language: z.enum(['de','en']), memories: z.array(z.string().trim().max(600)).length(3),
 message: z.string().trim().max(2000),
});
export type Story = z.infer<typeof storySchema>;
export const emptyStory: Story = {from:'',to:'',occasion:'anniversary',language:'de',memories:['','',''],message:''};
export function readyStory(s: Story) { return !!(s.from && s.to && s.message && s.memories.every(Boolean)); }
