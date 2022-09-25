export interface TemplateStruct {
  templateId: string
  question: string
  ownerAddress: string
  numAnswers: number
}

export interface PromptStruct {
  templateId: number
  promptId: number
  question: string
}
