from game import determine_winner


def test_player_wins():
    assert determine_winner("rock", "scissors") == "player"


def test_computer_wins():
    assert determine_winner("scissors", "rock") == "computer"


def test_tie():
    assert determine_winner("rock", "rock") == "tie"
