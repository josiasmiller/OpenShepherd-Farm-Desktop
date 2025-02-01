
import json
import sys

def echoToStandardOut(transient: str):
    print(
        json.dumps(
            { 'message': " ".join(['Python says:', transient, transient, transient, transient]) }
        )
    )

if __name__ == '__main__':
    echoToStandardOut(sys.argv[1])