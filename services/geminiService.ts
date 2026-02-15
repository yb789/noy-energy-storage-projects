
import { GoogleGenAI } from "@google/genai";
import { Task, PartConfigs } from "../types";

// Always use named parameter for apiKey
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateFollowUpMessage(task: Task, configs: PartConfigs, type: 'whatsapp' | 'email'): Promise<string> {
  const partLabel = configs[task.partId].label;
  const prompt = `
    צור הודעת תזכורת למנהל פרויקט (נוי אגירה) לגבי משימה שדורשת בדיקת סטטוס.
    פרטי המשימה:
    כותרת: ${task.title}
    פרויקט: ${partLabel}
    אחראי בשטח: ${task.assignee.name} (${task.assignee.role})
    תאריך ושעת יעד למעקב: ${new Date(task.followUpDate).toLocaleDateString('he-IL')} בשעה ${task.reminderTime}
    
    סוג ההודעה המבוקש: ${type === 'whatsapp' ? 'תזכורת קצרה וממוקדת לוואטסאפ' : 'עדכון סטטוס מפורט למייל'}.
    ההודעה צריכה להזכיר למנהל לבדוק את התקדמות המשימה מול האחראי.
    אל תשתמש במירכאות סביב ההודעה. פשוט תחזיר את הטקסט עצמו.
  `;

  try {
    // Correct usage of generateContent with model name and prompt
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access .text property directly (not a method)
    return response.text || `תזכורת: עליך לבדוק את מצב המשימה "${task.title}" בפרויקט "${partLabel}" מול ${task.assignee.name}.`;
  } catch (error) {
    console.error('Error generating AI message:', error);
    return `תזכורת: עליך לבדוק את מצב המשימה "${task.title}" בפרויקט "${partLabel}" מול ${task.assignee.name}.`;
  }
}
