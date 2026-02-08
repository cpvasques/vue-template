import { MaskInput } from 'maska'

const checkInputValue = (input: Ref) => {
  if (!input.value) throw new Error('Ref not found')
}

const handleDocumentMask = (input: Ref) => {
  checkInputValue(input)

  new MaskInput(input.value, {
    mask: (value) => {
      const digitsOnly = value.replace(/\D/g, '')
      return digitsOnly.length > 11 ? '##.###.###/####-##' : '###.###.###-##'
    },
    tokens: {
      '#': { pattern: /\d/ },
    },
  })
}

const handlePhoneMask = (input: Ref) => {
  checkInputValue(input)

  new MaskInput(input.value, {
    mask: (value) => {
      const digitsOnly = value.replace(/\D/g, '')
      return digitsOnly.length >= 11 ? '(##) #####-####' : '(##) ####-####'
    },
    tokens: {
      '#': { pattern: /\d/ },
    },
  })
}

const handleCpfMask = (input: Ref) => {
  checkInputValue(input)

  new MaskInput(input.value, {
    mask: () => '###.###.###-##',
    tokens: {
      '#': { pattern: /\d/ },
    },
  })
}

const handleCnpjMask = (input: Ref) => {
  checkInputValue(input)

  new MaskInput(input.value, {
    mask: () => '##.###.###/####-##',
    tokens: {
      '#': { pattern: /\d/ },
    },
  })
}

const handleDateMask = (input: Ref) => {
  checkInputValue(input)

  new MaskInput(input.value, {
    mask: () => '##/##/####',
    tokens: {
      '#': { pattern: /\d/ },
    },
  })
}

const handleMonetaryMask = (input: Ref) => {
  checkInputValue(input)

  const generateMoneyMask = (digits: number): string => {
    if (digits <= 3) return 'R$ #,##'
    if (digits <= 5) return `R$ ${'#'.repeat(digits - 2)},##`

    // Para valores maiores -> calcula grupos de milhares
    const integerDigits = digits - 2 // Remove as 2 casas decimais
    const groups = Math.ceil(integerDigits / 3)

    let mask = 'R$ '
    for (let i = 0; i < groups; i++) {
      const groupSize = i === 0 ? integerDigits % 3 || 3 : 3
      mask += '#'.repeat(groupSize)
      if (i < groups - 1) mask += '.'
    }
    mask += ',##'

    return mask
  }

  new MaskInput(input.value, {
    mask: (value: string) => {
      const digits = value.replace(/\D/g, '').length
      return generateMoneyMask(digits)
    },
    tokens: {
      '#': { pattern: /\d/ },
    },
  })
}

export const useMask = () => {
  return {
    handleDocumentMask,
    handlePhoneMask,
    handleCpfMask,
    handleCnpjMask,
    handleDateMask,
    handleMonetaryMask,
  }
}
