"""Shopping List — a tiny cart builder (intro Python project).

A first Python project small enough to hold in your head, but with two spots
where the obvious mental model is wrong. Those are the moments Duckling's
Mental Model Mode is built for.

Run it and see if the output matches what you expected:

    python3 shopping.py
"""


def add_item(item, cart=[]):
    """Add one item to a shopper's cart and return the cart."""
    cart.append(item)
    return cart


def duplicate_cart(cart):
    """Make a copy of a cart before we change it."""
    backup = cart
    return backup


def deep_total(items):
    """Sum every price in a cart that may contain nested 'bundle' lists."""
    total = 0
    for x in items:
        if isinstance(x, list):
            total += deep_total(x)
        else:
            total += x
    return total


if __name__ == "__main__":
    # Two different shoppers each start a cart with one item.
    amir = add_item("apples")
    carissa = add_item("bread")
    print("Amir's cart:   ", amir)
    print("Carissa's cart:", carissa)

    # Back up Amir's cart, then add one more item to it.
    saved = duplicate_cart(amir)
    add_item("milk", amir)
    print("Amir now:      ", amir)
    print("Backup:        ", saved)

    # Total up a cart that has a bundle (the [5, 2]) plus loose items.
    prices = [3, [5, 2], 4]
    print("Total price:   ", deep_total(prices))
