import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class AiAnalysisService {
  private genAI: GoogleGenerativeAI;

 constructor() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      throw new Error("La variable de entorno GOOGLE_GENERATIVE_AI_API_KEY no está definida.");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analizarEvolucion(historial: { year: number, value: number }[]): Promise<string> {
    try {
      
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });    
      const prompt = `Analiza la siguiente trayectoria de habilidades de un jugador de FIFA: ${JSON.stringify(historial)}. 
      Identifica picos, declives o transiciones importantes y devuelve un párrafo resumen profesional y conciso sobre su evolución.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error detallado de la IA:", error);
      throw new Error("No se pudo conectar con el servicio de IA");
    }
  }
}