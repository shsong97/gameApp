def determine_winner(player, computer):
    if player == computer:
        return "tie"
    beats = {"rock": "scissors", "scissors": "paper", "paper": "rock"}
    if beats[player] == computer:
        return "player"
    return "computer"


def main():
    print("Rock, Paper, Scissors!")
    player = input("Choose rock, paper, or scissors: ").strip().lower()
    computer = "rock"
    print(f"Computer chose: {computer}")
    print(f"Result: {determine_winner(player, computer)}")


if __name__ == "__main__":
    main()
