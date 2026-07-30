def evaluate_quiz(
    answers: list[str],
    correct_answers: list[str]
):

    score = 0

    for user, correct in zip(
        answers,
        correct_answers
    ):
        if user == correct:
            score += 1

    total = len(correct_answers)

    percentage = round(
        (score / total) * 100,
        2
    )

    if percentage >= 90:
        result = "Excellent"
        recommendation = (
            "You have mastered this topic and can move on."
        )

    elif percentage >= 70:
        result = "Good"
        recommendation = (
            "Review the questions you missed and continue."
        )

    elif percentage >= 50:
        result = "Average"
        recommendation = (
            "Spend another study session on this topic."
        )

    else:
        result = "Needs Improvement"
        recommendation = (
            "Revise the study plan and retake the quiz."
        )

    return {
        "score": score,
        "total": total,
        "percentage": percentage,
        "result": result,
        "recommendation": recommendation
    }