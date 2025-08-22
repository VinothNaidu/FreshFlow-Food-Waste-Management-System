// src/pages/FeedbackPage.tsx

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const FeedbackPage = () => {
  const [feedbackText, setFeedbackText] = useState<string>("");

  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      alert("Please enter your feedback before submitting.");
      return;
    }

    fetch("http://localhost:3000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Anonymous", content: feedbackText }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit feedback.");
        return res.json();
      })
      .then(() => {
        setFeedbackText("");
        alert("Feedback submitted successfully!");
      })
      .catch((err) => {
        console.error("Error submitting feedback:", err);
        alert("Failed to submit feedback. Please try again later.");
      });
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
          <CardDescription>Share your thoughts on system improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full h-24 p-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your feedback here..."
            />
            <Button onClick={submitFeedback} className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
