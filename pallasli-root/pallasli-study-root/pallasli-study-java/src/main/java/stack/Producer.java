package stack;

public class Producer implements Runnable {
	SyncStack stack;

	public Producer(SyncStack s) {
		stack = s;
	}

	@Override
	public void run() {
		for (int i = 0; i < 20; i++) {
			char c = (char) (Math.random() * 26 + 'A');
			stack.push(c);
			System.out.println("produced：" + c);
			try {
				Thread.sleep((int) (Math.random() * 1000));
			} catch (InterruptedException e) {
			}
		}
	}
}