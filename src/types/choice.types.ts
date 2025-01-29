import type { Choice as C } from '@lexjs/prompts/lib';

export interface Choice<Value> extends C {
  value: Value;
}
