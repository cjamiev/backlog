import { type Word, WORD_TYPE } from '../model/library';

export const fakeWords: Word[] = [
  {
    value: 'serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    type: WORD_TYPE.noun,
    tags: 'luck,fortune,chance'
  },
  {
    value: 'ephemeral',
    definition: 'Lasting for a very short time; transitory.',
    type: WORD_TYPE.adjective,
    tags: 'temporary,short-lived,transient'
  },
  {
    value: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere.',
    type: WORD_TYPE.adjective,
    tags: 'everywhere,omnipresent,common'
  },
  {
    value: 'mellifluous',
    definition: 'Sweet or musical; pleasant to hear.',
    type: WORD_TYPE.adjective,
    tags: 'sweet,musical,pleasant'
  },
  {
    value: 'perspicacious',
    definition: 'Having a ready insight into and understanding of things.',
    type: WORD_TYPE.adjective,
    tags: 'insightful,perceptive,wise'
  },
  {
    value: 'quintessential',
    definition: 'Representing the most perfect or typical example of a quality or class.',
    type: WORD_TYPE.adjective,
    tags: 'perfect,typical,exemplary'
  },
  {
    value: 'eloquent',
    definition: 'Fluent or persuasive in speaking or writing.',
    type: WORD_TYPE.adjective,
    tags: 'articulate,persuasive,fluent'
  },
  {
    value: 'resilient',
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    type: WORD_TYPE.adjective,
    tags: 'strong,flexible,adaptable'
  },
  {
    value: 'contemplate',
    definition: 'Look thoughtfully for a long time at.',
    type: WORD_TYPE.verb,
    tags: 'think,consider,reflect'
  },
  {
    value: 'illuminate',
    definition: 'Light up or make clear.',
    type: WORD_TYPE.verb,
    tags: 'light,clarify,explain'
  }
]; 