# Adventure Game

class Room:
    def __init__(self, name, description, exits):
        self.name = name
        self.description = description
        self.exits = exits  # dict: direction -> room name

class Player:
    def __init__(self, current_room):
        self.current_room = current_room

rooms = {
    'hall': Room('Hall', 'You are in a grand hall. Exits: north.', {'north': 'kitchen'}),
    'kitchen': Room('Kitchen', 'You are in a kitchen. Exits: south.', {'south': 'hall'})
}

player = Player('hall')

def show_room():
    room = rooms[player.current_room]
    print(f"\n{room.name}\n{room.description}")

def main():
    print("Welcome to the Adventure Game!")
    while True:
        show_room()
        command = input("What do you do? (move/look/quit): ").strip().lower()
        if command == 'quit':
            print("Thanks for playing!")
            break
        elif command == 'look':
            show_room()
        elif command.startswith('move'):
            parts = command.split()
            if len(parts) == 2:
                direction = parts[1]
                room = rooms[player.current_room]
                if direction in room.exits:
                    player.current_room = room.exits[direction]
                    print(f"You move {direction}.")
                else:
                    print("You can't go that way.")
            else:
                print("Move where? (move north/south)")
        else:
            print("Unknown command.")

if __name__ == '__main__':
    main()
