import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/Sidebar";
import { Trophy, Star, RefreshCw } from "lucide-react";

const quizQuestions = [
  {
    question: "What should you do first when you feel an earthquake?",
    options: [
      "Run outside immediately",
      "Drop, Cover, and Hold On",
      "Call emergency services",
      "Get under a doorway"
    ],
    correct: 1,
    explanation: "Drop, Cover, and Hold On is the recommended immediate response to earthquake shaking."
  },
  {
    question: "How much water should you store per person per day for emergencies?",
    options: [
      "1 liter",
      "2 liters", 
      "3 liters",
      "4 liters"
    ],
    correct: 3,
    explanation: "Emergency preparedness guidelines recommend storing 4 liters of water per person per day."
  },
  {
    question: "What should you do if you encounter flood water while driving?",
    options: [
      "Drive through quickly",
      "Turn around and find another route",
      "Drive slowly through the water",
      "Wait in your car until water recedes"
    ],
    correct: 1,
    explanation: "Turn Around, Don't Drown! Just 6 inches of moving water can knock you over, and 12 inches can carry away vehicles."
  },
  {
    question: "How often should you test smoke detectors?",
    options: [
      "Once a year",
      "Every 6 months",
      "Once a month",
      "Every 3 months"
    ],
    correct: 2,
    explanation: "Smoke detectors should be tested monthly and batteries changed at least once a year."
  },
  {
    question: "During a cyclone, when is it safe to go outside?",
    options: [
      "When winds die down slightly",
      "During the eye of the storm",
      "Only after authorities give the all-clear",
      "When rain stops"
    ],
    correct: 2,
    explanation: "Only go outside after authorities officially declare it safe. The eye of the storm can be deceptively calm."
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      if (selectedAnswer === quizQuestions[currentQuestion].correct) {
        setScore(score + 1);
      }
      
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(answers[currentQuestion + 1]);
        setShowExplanation(false);
      } else {
        setQuizCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowExplanation(false);
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
    setAnswers(new Array(quizQuestions.length).fill(null));
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) return { message: "Excellent! You're a Disaster Safety Expert! 🏆", badge: "Safety Expert", color: "accent" };
    if (percentage >= 80) return { message: "Great job! You're well-prepared! 🌟", badge: "Safety Star", color: "primary" };
    if (percentage >= 70) return { message: "Good work! Keep learning! 👍", badge: "Safety Learner", color: "secondary" };
    return { message: "Keep studying! You'll get better! 📚", badge: "Future Hero", color: "primary" };
  };

  if (quizCompleted) {
    const scoreData = getScoreMessage();
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</CardTitle>
                <p className="text-xl text-muted-foreground">{scoreData.message}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {score}/{quizQuestions.length}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {Math.round((score / quizQuestions.length) * 100)}% Correct
                  </div>
                </div>

                <div className={`bg-gradient-to-r from-${scoreData.color}/5 to-${scoreData.color}/10 rounded-lg p-4 border border-${scoreData.color}/20`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className={`h-6 w-6 text-${scoreData.color}`} />
                    <span className={`font-semibold text-${scoreData.color}`}>Badge Earned:</span>
                  </div>
                  <div className={`text-xl font-bold text-${scoreData.color}`}>{scoreData.badge} 🏅</div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={restartQuiz}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Take Quiz Again
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => window.history.back()}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-foreground">Safety Quiz</h1>
              <span className="text-lg font-medium text-muted-foreground">
                {currentQuestion + 1} of {quizQuestions.length}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? showExplanation
                        ? index === question.correct
                          ? "border-accent bg-accent/10 text-accent font-medium"
                          : "border-secondary bg-secondary/10 text-secondary font-medium"
                        : "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-primary/50 hover:bg-hover"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                      selectedAnswer === index
                        ? showExplanation
                          ? index === question.correct
                            ? "border-accent text-accent"
                            : "border-secondary text-secondary"
                          : "border-primary text-primary"
                        : "border-muted-foreground text-muted-foreground"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Explanation */}
          {showExplanation && (
            <Card className="mb-6 border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-accent mb-2">Explanation:</p>
                    <p className="text-foreground">{question.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {selectedAnswer !== null && !showExplanation && (
                <Button 
                  variant="outline"
                  onClick={handleShowExplanation}
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  Show Explanation
                </Button>
              )}
              
              <Button 
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-primary to-accent text-white"
              >
                {currentQuestion === quizQuestions.length - 1 ? "Finish Quiz" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;