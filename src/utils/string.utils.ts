const ACCENTS_REGEX = /[\u0300-\u036f]/g; // NOTE: Regular Expression

const normalizator = (string: string) => {
  return string.normalize("NFD") // NOTE: normalized form diacritical (diacritical characters)
  .replace(ACCENTS_REGEX, "")
  .replace("ç", "c");
}

async function main(): Promise<void> {
  const text = "Olá, como está você? Quer uma maçã?";

  console.log(normalizator(text));
}

main().catch((error: any) => console.log(error));

// NOTE: 'maçã' and 'maca', are completely different words in portuguese