"""Sample task for the Duckling walkthrough — a tiny shopping cart.

Two shoppers each add one item to their own cart. Run it and see whether the
output matches what you'd expect:

    python3 sample.py
"""


def add_item(item, cart=[]):
    cart.append(item)
    return cart


if __name__ == "__main__":
    first = add_item("apples")
    second = add_item("bread")
    print("First cart: ", first)
    print("Second cart:", second)
