/**
 * OCR.space API configuration — infrastructure layer.
 * All values specific to the OCR.space provider live here.
 */
export const OCR_SPACE_CONFIG = {
  ENDPOINT: 'https://api.ocr.space/parse/image',
  LANGUAGE: 'por',
  ENGINE: '2',
  OVERLAY_REQUIRED: 'false',
  FILE_TYPE: 'PDF',
  GENERIC_ERROR: 'OCR processing error',
  HTTP_ERROR_PREFIX: 'OCR request failed:',
} as const
