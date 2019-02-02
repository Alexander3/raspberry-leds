from django.apps import AppConfig
import signal
import sys
import threading
from led.domain.leds import clear


class LedConfig(AppConfig):
    name = 'led'

    def ready(self):
        def signal_handler(sig, frame):
            clear()
            sys.exit(0)

        if threading.current_thread().name == 'MainThread':
            signal.signal(signal.SIGINT, signal_handler)
            signal.signal(signal.SIGTERM, signal_handler)
