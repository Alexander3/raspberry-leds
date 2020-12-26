import logging
import math
from time import sleep
from unittest.mock import MagicMock

import numpy as np

logger = logging.getLogger(__name__)
try:
    import pigpio

    real = True
except ImportError:
    real = False
    logger.info("Mocking pigpio")
    pigpio = MagicMock()
    pigpio.pi().set_PWM_dutycycle.side_effect = lambda *args: logger.debug('set {}'.format(args))
    pigpio.pi().get_PWM_real_range.return_value = 500

RED_PIN = 16
GREEN_PIN = 20
BLUE_PIN = 21

"""Last 3 pins:
13  G
19  16
26  20
G   21
"""


class LedController:
    def __init__(self):
        self.pi = pigpio.pi()
        self.currentColor = 0, 0, 0
        self.pins = [RED_PIN, GREEN_PIN, BLUE_PIN]
        for pin in self.pins:
            # Default freq is 800Hz which gives range of 250
            # This is software PWM, hardware is only available on some pins
            self.pi.set_PWM_frequency(pin, 400)
            self.max_val = self.pi.get_PWM_real_range(pin)
            self.pi.set_PWM_range(pin, self.max_val)

    def scale(self, val):
        return round(val / 255 * self.max_val)

    def clear(self):
        self.set_led_colors(0, 0, 0)
        self.pi.stop()

    def sine_wave(self, t, f=1, phi=0):
        value = round(128 * math.sin(2 * math.pi * f * t + phi)) + 127
        return max(min(value, 255), 0)

    def set_led_colors(self, r, g, b):
        self.pi.set_PWM_dutycycle(RED_PIN, self.scale(r))
        self.pi.set_PWM_dutycycle(GREEN_PIN, self.scale(g))
        self.pi.set_PWM_dutycycle(BLUE_PIN, self.scale(b))
        self.currentColor = r, g, b
        if not real:
            logger.info('{} {} {}'.format(r, g, b))

    def lerp(self, to, time=1):
        frequency = 30
        print(self.currentColor, '->', to)
        for color in np.linspace(list(self.currentColor), list(to), num=time * frequency, dtype=np.float32):
            print(*tuple(color))
            self.set_led_colors(*tuple(color))
            sleep(1 / (frequency - 1))


led_strip = LedController()
