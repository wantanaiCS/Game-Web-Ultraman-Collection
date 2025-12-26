
export interface Question {
    id: number;
    text: string;
    choices: string[];
    correctIndex: number;
}

export class QuizManager {
    private questions: Question[] = [
        { id: 1, text: "Wait is 'Sister' in Thai?", choices: ["พี่สาว/น้องสาว", "พี่ชาย/น้องชาย", "แม่", "ป้า"], correctIndex: 0 },
        { id: 2, text: "What is 5 + 7?", choices: ["10", "11", "12", "13"], correctIndex: 2 },
        { id: 3, text: "Which Ultraman is Tiga?", choices: ["Red/Silver", "Red/Blue", "All Silver", "Blue"], correctIndex: 0 },
        { id: 4, text: "What year is 2025 in Buddhist Era?", choices: ["2566", "2567", "2568", "2569"], correctIndex: 2 },
        { id: 5, text: "What is 'Cat' in Thai?", choices: ["หมา", "แมว", "นก", "ปลา"], correctIndex: 1 },
        { id: 6, text: "12 / 4 = ?", choices: ["2", "3", "4", "6"], correctIndex: 1 },
    ];
    
    private finisherQuestions: Question[] = [
        { id: 99, text: "FINISHER: (10 * 10) - 50 = ?", choices: ["40", "50", "60", "100"], correctIndex: 1 }
    ];

    getRandomQuestion(): Question {
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        return this.questions[randomIndex];
    }
    
    getFinisherQuestion(): Question {
        return this.finisherQuestions[0]; // Just one for now
    }
    
    checkAnswer(question: Question, answerIndex: number): boolean {
        return question.correctIndex === answerIndex;
    }
}

export const quizManager = new QuizManager();
