import { useEffect } from "react";

export const readFileAsDataUrl = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
    }

    reader.readAsDataURL(file);
  })
}



