"""Streak Tracker — a tiny habit tracker (intro Python project).

A first Python project small enough to hold in your head, but with two spots
where the obvious mental model is wrong. Those are the moments Duckling's
Mental Model Mode is built for.

Run it and see if the output matches what you expected:

    python3 streak.py
"""


def log_practice(minutes, session=[]):
    """Record one practice session and return the running list for a learner."""
    session.append(minutes)
    return session


def back_up(progress):
    """Make a backup of a learner's progress before we change it."""
    backup = progress
    return backup


def current_streak(days):
    """How many days in a row (counting back from today) had practice?

    `days` is a list of booleans, oldest first, most recent last.
    """
    if not days or days[-1] is False:
        return 0
    return 1 + current_streak(days[:-1])


if __name__ == "__main__":
    # Two different learners each log a single session.
    amir = log_practice(20)
    bela = log_practice(15)
    print("Amir's sessions:", amir)
    print("Bela's sessions:", bela)

    # Back up Amir's progress, then he practices once more.
    saved = back_up(amir)
    log_practice(30, amir)
    print("Amir now:       ", amir)
    print("Backup:         ", saved)

    # Did this week keep a streak going? (Mon..Sun, most recent last.)
    week = [True, True, False, True, True, True]
    print("Current streak: ", current_streak(week), "days")
