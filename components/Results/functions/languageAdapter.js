export const languageAdapter = (baseLanguage) => {
    let finalLanguage;
    switch (baseLanguage) {
        case 'jp':
            finalLanguage = 'ja'
            break;
        case 'ch':
            finalLanguage = 'zh-cn'
            break;
        case 'du':
            finalLanguage = 'nl'
            break;
        default:
          finalLanguage = baseLanguage
          break;
    }
    return finalLanguage
};